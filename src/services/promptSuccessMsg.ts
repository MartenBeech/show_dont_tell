export function GetRandomPromptSuccessMessage() {
  const successMessage = [
    "Good one!",
    "Very funny!",
    "Best one so far!",
    "Literally a good prompt!",
    "Super duper!",
    "Woohoooo!",
    "You did amazing!",
    "We are all very proud of you!",
    "Now give me another one!",
    "I could never come up with that!",
    "Yaaaaaay!",
    "Hooraaaaay!",
    "Pretty high standard you have set!",
    "Your ancestors would be proud!",
    "Chuck Norris approves!",
    "You are the president of awesomeness!",
  ];

  const rnd = Math.floor(Math.random() * successMessage.length);
  return `Successfully submitted prompt. ${successMessage[rnd]}`;
}
