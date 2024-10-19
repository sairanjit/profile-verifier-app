import {
  DEFAULT_DIDCOMM_INDICATE_CHARACTERISTIC_UUID,
  DEFAULT_DIDCOMM_MESSAGE_CHARACTERISTIC_UUID,
  Peripheral,
} from "@animo-id/react-native-ble-didcomm"
import {
  type Agent,
  ConnectionEventTypes,
  ConnectionRecord,
  ConnectionStateChangedEvent,
  DidExchangeState,
  MessageReceiver,
} from "@credo-ts/core"
import { BleOutboundTransport } from "@credo-ts/transport-ble"
import { AppAgent } from "./agent"
import {
  ConnectionProfileUpdatedEvent,
  ProfileEventTypes,
  UserProfileData,
} from "@2060.io/credo-ts-didcomm-user-profile"

export type BleRequestProofOptions = {
  agent: Agent
  peripheral: Peripheral
  serviceUuid: string
  userProfileRequestTemplate: any
  onFailure: () => Promise<void> | void
  onConnected?: () => Promise<void> | void
  onDisconnected?: () => Promise<void> | void
}

export const bleRequestUserData = async ({
  peripheral,
  agent,
  serviceUuid,
  userProfileRequestTemplate,
  onFailure,
  onConnected,
  onDisconnected,
}: BleRequestProofOptions) => {
  try {
    await startBleTransport(agent, peripheral)

    await startPeripheral(peripheral, agent, serviceUuid)

    disconnectedNotifier(agent, peripheral, onDisconnected)

    const outOfBandId = await sendInvitationWhenConnected(
      agent,
      peripheral,
      serviceUuid,
      onConnected
    )

    const messageListener = startMessageReceiver(agent, peripheral)
    console.log("check 111")
    await returnWhenConnected(
      outOfBandId,
      agent,
      peripheral,
      userProfileRequestTemplate
    )

    console.log("Connection is completed outOfBandId", outOfBandId)

    const { connection, profile } = await returnWhenProfileReceived(
      outOfBandId,
      agent
    )

    console.log("\n\n profile", profile)
    console.log("\n\n connection", connection)

    // await returnWhenProofReceived(proofRecordId, agent, peripheral)
    messageListener.remove()

    return { connection, profile }
  } catch (e) {
    if (e instanceof Error) {
      agent.config.logger.error(e.message, { cause: e })
    } else {
      agent.config.logger.error(e as string)
    }
    onFailure()
    throw e
  }
}

const startBleTransport = async (agent: Agent, peripheral: Peripheral) => {
  const bleOutboundTransport = new BleOutboundTransport(peripheral)
  agent.registerOutboundTransport(bleOutboundTransport)
  await bleOutboundTransport.start(agent)
}

const startPeripheral = async (
  peripheral: Peripheral,
  agent: Agent,
  serviceUuid: string
) => {
  await peripheral.start()

  await peripheral.setService({
    serviceUUID: serviceUuid,
    messagingUUID: DEFAULT_DIDCOMM_MESSAGE_CHARACTERISTIC_UUID,
    indicationUUID: DEFAULT_DIDCOMM_INDICATE_CHARACTERISTIC_UUID,
  })

  await peripheral.advertise()
  agent.config.logger.info(
    `[PERIPHERAL]: Advertising on service UUID '${serviceUuid}'`
  )
}

const sendInvitationWhenConnected = async (
  agent: Agent,
  peripheral: Peripheral,
  serviceUuid: string,
  onConnected?: () => Promise<void> | void
) =>
  new Promise<string>((resolve) => {
    const connectedListener = peripheral.registerOnConnectedListener(
      async () => {
        if (onConnected) await onConnected()
        const { message, outOfBandId } =
          await createBleConnectionInvitationMessage(agent, serviceUuid)
        await peripheral.sendMessage(message)
        connectedListener.remove()
        resolve(outOfBandId)
      }
    )
  })

const disconnectedNotifier = (
  agent: Agent,
  peripheral: Peripheral,
  onDisconnected?: () => Promise<void> | void
) => {
  const disconnectedListener = peripheral.registerOnDisconnectedListener(
    async ({ identifier }) => {
      agent.config.logger.info(
        `[PERIPHERAL]: Disconnected from device ${identifier}`
      )
      if (onDisconnected) await onDisconnected()
      disconnectedListener.remove()
    }
  )
}

// TODO: is this required?
const startMessageReceiver = (agent: Agent, peripheral: Peripheral) => {
  const messageReceiver = agent.dependencyManager.resolve(MessageReceiver)
  return peripheral.registerMessageListener(async ({ message }) => {
    agent.config.logger.info(
      `[PERIPHERAL]: received message ${message.slice(0, 16)}...`
    )
    await messageReceiver.receiveMessage(JSON.parse(message))
  })
}

const returnWhenConnected = (
  id: string,
  agent: AppAgent,
  peripheral: Peripheral,
  userProfileRequestTemplate: string[]
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const listener = async ({
      payload: { connectionRecord },
    }: ConnectionStateChangedEvent) => {
      console.log("connectionRecord check", connectionRecord)
      console.log("connectionRecord 1111", connectionRecord?.outOfBandId, id)
      const off = () =>
        agent.events.off(ConnectionEventTypes.ConnectionStateChanged, listener)

      // TODO: Need to check this
      // if (connectionRecord?.outOfBandId !== id) return
      if (connectionRecord.state === DidExchangeState.Completed) {
        console.log("connectionRecord.state", connectionRecord.state)
        await agent.modules.userProfile.requestUserProfile({
          connectionId: connectionRecord.id,
          query: userProfileRequestTemplate,
        })

        // const serializedMessage = JsonTransformer.serialize(message)
        // await peripheral.sendMessage(serializedMessage)
        // TODO: Need to check this
        off()
        resolve()
      } else if (
        [DidExchangeState.Abandoned].includes(connectionRecord.state)
      ) {
        off()
        reject(
          new Error(
            `Connection could not be shared because it has been ${connectionRecord.state}`
          )
        )
      } else {
        console.log("connectionRecord.state no where", connectionRecord.state)
      }
    }
    agent.events.on<ConnectionStateChangedEvent>(
      ConnectionEventTypes.ConnectionStateChanged,
      listener
    )
  })
}

const returnWhenProfileReceived = (id: string, agent: Agent) => {
  return new Promise<{
    profile: UserProfileData
    connection: ConnectionRecord
  }>((resolve, reject) => {
    const listener = async ({
      payload: { connection, profile },
    }: ConnectionProfileUpdatedEvent) => {
      const off = () =>
        agent.events.off(ProfileEventTypes.ConnectionProfileUpdated, listener)
      // if (connection?.outOfBandId !== id) return

      off()
      console.log("profile", profile)
      console.log("connection", connection)
      resolve({ profile, connection })
    }
    agent.events.on<ConnectionProfileUpdatedEvent>(
      ProfileEventTypes.ConnectionProfileUpdated,
      listener
    )
  })
}

const createBleConnectionInvitationMessage = async (
  agent: Agent,
  serviceUuid: string
) => {
  const routing = await agent.mediationRecipient.getRouting({
    useDefaultMediator: false,
  })
  routing.endpoints = [`ble://${serviceUuid}`]
  const { outOfBandInvitation } = await agent.oob.createInvitation({
    routing,
  })

  return {
    message: outOfBandInvitation.toUrl({ domain: "http://github.com" }),
    outOfBandId: outOfBandInvitation.threadId,
  }
}
