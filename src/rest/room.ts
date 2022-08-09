import { doc, getDoc, collection, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./auth";

export interface Room {
  roomName: string;
  prompts: Array<string>;
  players: Array<string>;
  images: Array<string>;
}

interface getRoomProps {
  roomName: string;
}

export async function GetRoom(props: getRoomProps): Promise<Room> {
  let returnValue: Room;
  const docRef = doc(db, "rooms", props.roomName);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const snapData = docSnap.data();
    returnValue = <Room>snapData;
  }
  return returnValue;
}

interface createRoomProps {
  roomName: string;
}

export async function CreateRoom(props: createRoomProps) {
  const colRef = collection(db, "rooms");
  const room = await GetRoom({ roomName: props.roomName });

  if (!room) {
    await setDoc(doc(colRef, props.roomName), {
      roomName: props.roomName,
    });
  }
}

interface loginPlayerProps {
  roomName: string;
  playerName: string;
}

export async function LoginPlayer(props: loginPlayerProps) {
  const colRef = collection(db, "rooms");
  const room = await GetRoom({ roomName: props.roomName });

  let players: Array<string>;
  if (room.players) {
    players = room.players;
    players.push(props.playerName);
  } else {
    players = [props.playerName];
  }

  await updateDoc(doc(colRef, props.roomName), {
    players: players,
  });
}

interface createPrompt {
  roomName: string;
  prompt: string;
}

export async function CreatePrompt(props: createPrompt) {
  const colRef = collection(db, "rooms");
  const room = await GetRoom({ roomName: props.roomName });

  let prompts: Array<string>;
  if (room.prompts) {
    prompts = room.players;
    prompts.push(props.prompt);
  } else {
    prompts = [props.prompt];
  }

  await updateDoc(doc(colRef, props.roomName), {
    prompts: prompts,
  });
}

interface getPromptsProps {
  roomName: string;
}

export async function GetPrompts(props: getPromptsProps) {
  const room = await GetRoom({ roomName: props.roomName });

  const defaultPrompts = ["Prompt 1", "Prompt 2", "Prompt 3"];

  defaultPrompts.push(...room.prompts);

  return defaultPrompts;
}
