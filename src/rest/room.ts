import { doc, getDoc, collection, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./auth";
import { RoomName } from "../components/pages/login";

export interface Room {
  gameStarted: boolean;
  gameVoting: boolean;
  imageWinning: number;
  images: Array<string>;
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

interface submitImageProps {
  player: string;
  image: string;
}

export async function SubmitImage(props: submitImageProps) {
  const colRef = collection(db, "rooms");
  const room = await GetRoom();

  let playerIndex: number;
  room.players.map((player, index) => {
    if (player === props.player) {
      playerIndex = index;
    }
  });

  if (playerIndex != undefined) {
    const images = [...room.images];
    images[playerIndex] = props.image;
    await updateDoc(doc(colRef, RoomName), {
      images: images,
    });
  }
}

export async function NewPlayerTurn() {
  const colRef = collection(db, "rooms");
  const room = await GetRoom();
  let playerTurn = room.playerTurn + 1;
  if (playerTurn >= room.players.length) {
    playerTurn = 0;
  }

  const images: Array<string> = [];
  for (let i = 0; i < room.players.length; i++) {
    images.push("");
  }

  await updateDoc(doc(colRef, RoomName), {
    playerTurn: playerTurn,
    images: images,
    gameVoting: false,
    imageWinning: -1,
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

export async function CreateRoom() {
  const colRef = collection(db, "rooms");
  const room = await GetRoom();

  if (!room) {
    await setDoc(doc(colRef, RoomName), {
      gameStarted: false,
      gameVoting: false,
      imageWinning: -1,
      images: [],
      playerTurn: -1,
      players: [],
      prompts: [
        "What tattoo could you imagine the judge getting?",
        "Where do you see the judge in 10 years?",
        "What could be the judge's favorite hobby?",
        "What image best describes the judge's home country?",
        "How would the judge dress up for a first date?",
        "What should be the judge's new background wallpaper?",
        "The judge could easily wear a t-shirt in public with this image printed on it.",
      ],
      roomName: RoomName,
    });
  }
}
