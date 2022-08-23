import { doc, getDoc, collection, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./auth";
import { RoomName } from "../components/pages/login";
import { DeleteFolder, UploadImage } from "./storage";

export interface Room {
  gameStarted: boolean;
  gameVoting: boolean;
  imageWinning: number;
  imagesSubmitted: number;
  playerTurn: number;
  players: Array<string>;
  prompts: Array<string>;
  roomName: string;
}

export async function GetRoom(): Promise<Room> {
  let returnValue: Room;
  const docRef = doc(db, "rooms", RoomName);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const snapData = docSnap.data();
    returnValue = <Room>snapData;
  }
  return returnValue;
}

interface loginPlayerProps {
  playerName: string;
}

export async function LoginPlayer(props: loginPlayerProps) {
  const colRef = collection(db, "rooms");
  const room = await GetRoom();

  let players: Array<string>;
  if (room.players) {
    players = room.players;
    players.push(props.playerName);
  } else {
    players = [props.playerName];
  }

  await updateDoc(doc(colRef, RoomName), {
    players: players,
  });

  return players.length - 1;
}

interface createPrompt {
  prompt: string;
}

export async function SubmitPrompt(props: createPrompt) {
  const colRef = collection(db, "rooms");
  const room = await GetRoom();

  let prompts: Array<string>;
  if (room.prompts) {
    prompts = room.prompts;
    prompts.push(props.prompt);
  } else {
    prompts = [props.prompt];
  }

  await updateDoc(doc(colRef, RoomName), {
    prompts: prompts,
  });
}

export async function StartGame() {
  const colRef = collection(db, "rooms");

  await updateDoc(doc(colRef, RoomName), {
    gameStarted: true,
  });

  NewPlayerTurn();
}

export async function StartVoting() {
  const colRef = collection(db, "rooms");

  await updateDoc(doc(colRef, RoomName), {
    gameVoting: true,
  });
}

export async function NewPlayerTurn() {
  const colRef = collection(db, "rooms");
  const room = await GetRoom();
  let playerTurn = room.playerTurn + 1;
  if (playerTurn >= room.players.length) {
    playerTurn = 0;
  }

  DeleteFolder({ roomName: RoomName });

  await updateDoc(doc(colRef, RoomName), {
    playerTurn: playerTurn,
    gameVoting: false,
    imageWinning: -1,
    imagesSubmitted: 0,
  });
}

interface setImageWinningProps {
  imageWinning: number;
}

export async function SetImageWinning(props: setImageWinningProps) {
  const colRef = collection(db, "rooms");

  await updateDoc(doc(colRef, RoomName), {
    imageWinning: props.imageWinning,
  });
}

interface submitImageProps {
  image: File;
}

export async function SubmitImage(props: submitImageProps) {
  UploadImage({ image: props.image, roomName: RoomName });

  const colRef = collection(db, "rooms");
  const room = await GetRoom();

  await updateDoc(doc(colRef, RoomName), {
    imagesSubmitted: room.imagesSubmitted + 1,
  });
}

export async function DeleteAllPlayers() {
  const colRef = collection(db, "rooms");
  const players: Array<string> = [];

  await updateDoc(doc(colRef, RoomName), {
    players: players,
  });

  return players.length - 1;
}

export async function CreateRoom() {
  const colRef = collection(db, "rooms");
  const room = await GetRoom();

  if (!room) {
    await setDoc(doc(colRef, RoomName), <Room>{
      gameStarted: false,
      gameVoting: false,
      imageWinning: -1,
      imagesSubmitted: 0,
      playerTurn: -1,
      players: [],
      prompts: [
        "What tattoo could you imagine Judge getting?",
        "Where do you see Judge in 10 years?",
        "What could be Judge's favorite hobby?",
        "What image best describes Judge's home country?",
        "How would Judge dress up for a first date?",
        "What should be Judge's new background wallpaper?",
        "Judge would love to wear a t-shirt with this image printed on it.",
        "What image would make Judge press super-like on Tinder?",
        "What image best describes Judge whenever they go to the bar?",
        "Judge the morning after going to a party.",
      ],
      roomName: RoomName,
    });
  }
}
