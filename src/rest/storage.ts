import {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

interface uploadImageProps {
  roomName: string;
  image: File;
}

export async function UploadImage(props: uploadImageProps) {
  const storage = getStorage();
  const imageRef = ref(storage, `${props.roomName}/${props.image.name}`);
  const uploadResult = await uploadBytes(imageRef, props.image);
  return uploadResult;
}

interface getImagesProps {
  roomName: string;
}

export async function GetImages(props: getImagesProps) {
  const storage = getStorage();
  const storageRef = ref(storage, props.roomName);
  const listRes = await listAll(storageRef);

  const URLs = await Promise.all(
    listRes.items.map((item) => {
      return getDownloadURL(item);
    })
  );

  return URLs;
}

interface deleteFolderProps {
  roomName: string;
}

export async function DeleteFolder(props: deleteFolderProps) {
  const storage = getStorage();
  const storageRef = ref(storage, props.roomName);
  if (storageRef) {
    const listRes = await listAll(storageRef);
    listRes.items.map((item) => {
      deleteObject(item);
    });
  }
}
