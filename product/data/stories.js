// Hearth story library
// ---------------------------------------------------------------------------
// Each story is written for one step of the scope & sequence: every word is
// decodable with the patterns taught up to that step, is a heart word already
// introduced, or is the family's own word ({child}, {grownup}). The validator
// (tools/validate-stories.mjs, run in tests) enforces this.
//
// `talk` prompts follow dialogic reading (CROWD: Completion, Recall, Open-ended,
// Wh-, Distancing). They are spoken to the parent, so they are not limited by
// decodability — they turn a short text into a long conversation.
//
// Scenes are drawn by js/art.js from a small vocabulary of elements.
// item: [element, x%, y% (baseline), scale, options]

export const STORIES = [
  {
    id: 'tap-tap-tap', step: 2, title: 'Tap, Tap, Tap', theme: ['family'],
    cover: { bg: 'room', items: [['grownup', 38, 86, 1.05], ['child', 60, 86, 1]] },
    pages: [
      { text: 'I am {child}.', talk: 'Point to the picture of you. Say your name together.', scene: { bg: 'room', items: [['child', 50, 86, 1.25]] } },
      { text: 'I am {Grownup}.', talk: 'Ask: Who is this? What do you call me?', scene: { bg: 'room', items: [['grownup', 50, 88, 1.2]] } },
      { text: '{child} and {Grownup} sat.', talk: 'Where do we like to sit together?', scene: { bg: 'room', items: [['rug', 50, 90, 1.3], ['grownup', 38, 86, 1], ['child', 62, 86, 0.95]] } },
      { text: 'Tap, tap, tap!', talk: 'Tap on your knees together: tap, tap, tap!', scene: { bg: 'room', items: [['grownup', 38, 86, 1, { pose: 'wave' }], ['child', 62, 86, 0.95, { pose: 'wave' }], ['notes', 50, 40, 1]] } },
      { text: 'Pat, pat, pat!', talk: 'Pat your tummy. Now pat my tummy!', scene: { bg: 'room', items: [['grownup', 40, 86, 1, { pose: 'hug' }], ['child', 60, 86, 0.95, { pose: 'hug' }], ['heart', 50, 36, 0.8]] } },
      { text: 'A nap? Nap, nap, nap.', talk: 'Do a big pretend yawn together.', scene: { bg: 'dusk', items: [['bed', 50, 88, 1.3], ['moon', 80, 30, 0.8]] } },
      { text: '{child} and {Grownup} nap.', talk: 'Where do you sleep? Who sleeps nearby?', scene: { bg: 'night', items: [['bed', 50, 88, 1.35, { sleepers: 2 }], ['moon', 82, 28, 0.9], ['stars', 30, 30, 1]] } },
    ],
  },
  {
    id: 'pip-the-cat', step: 4, title: 'Pip the Cat', theme: ['animals', 'home'],
    cover: { bg: 'room', items: [['cat', 50, 86, 1.5]] },
    pages: [
      { text: '{child} can pat a cat.', talk: 'Point to the cat. What sound does a cat make?', scene: { bg: 'room', items: [['child', 38, 86, 1], ['cat', 64, 86, 1]] } },
      { text: 'The cat is Pip.', talk: 'If you had a cat, what would you name it?', scene: { bg: 'room', items: [['cat', 50, 86, 1.6]] } },
      { text: 'Pip can tap. Tap, tap, tap!', talk: 'Can you tap like Pip? Use your paw!', scene: { bg: 'room', items: [['cat', 50, 86, 1.4, { pose: 'paw' }], ['ball', 72, 88, 0.7]] } },
      { text: 'Pip sat in a pan.', talk: 'Is a pan a good bed for a cat? Why not?', scene: { bg: 'kitchen', items: [['pan', 50, 86, 1.6], ['cat', 50, 82, 0.95], ['pan', 50, 86, 1.6, { front: true }]] } },
      { text: 'Pip sat in a cap.', talk: 'Where else could a cat sit? Silly or real?', scene: { bg: 'room', items: [['hat', 50, 90, 1.5, { kind: 'bowl' }], ['cat', 50, 82, 0.85], ['hat', 50, 90, 1.5, { kind: 'bowl', front: true }]] } },
      { text: 'Pip and {child} sit.', talk: 'Where is your favourite spot to sit?', scene: { bg: 'room', items: [['rug', 50, 90, 1.2], ['child', 42, 86, 1], ['cat', 64, 88, 0.85]] } },
      { text: 'Pip and {child} nap.', talk: 'Ask: What do you think Pip dreams about?', scene: { bg: 'night', items: [['bed', 50, 88, 1.35, { sleepers: 1 }], ['cat', 68, 76, 0.6, { pose: 'sleep' }], ['moon', 82, 28, 0.8]] } },
    ],
  },
  {
    id: 'dig-bob-dig', step: 6, title: 'Dig, Bob, Dig!', theme: ['animals', 'outside'],
    cover: { bg: 'day', items: [['dog', 50, 86, 1.5]] },
    pages: [
      { text: 'Bob is a big dog.', talk: 'Is Bob big or small? Show me with your hands.', scene: { bg: 'day', items: [['tree', 18, 86, 1.2], ['dog', 55, 86, 1.5]] } },
      { text: 'Bob can dig. Dig, dig, dig!', talk: 'Dig with your hands like Bob!', scene: { bg: 'day', items: [['dog', 45, 86, 1.3, { pose: 'dig' }], ['dirt', 62, 90, 1]] } },
      { text: 'Bob can dig a big pit.', talk: 'What do you think Bob will find?', scene: { bg: 'day', items: [['hole', 50, 92, 1.4], ['dog', 30, 86, 1.1]] } },
      { text: 'Is it a cap? It is not a cap.', talk: 'Not a cap! What could it be?', scene: { bg: 'day', items: [['hole', 50, 92, 1.4], ['dog', 30, 86, 1.1], ['question', 60, 50, 1]] } },
      { text: 'Is it a pot? It is not a pot.', talk: 'Not a pot! Guess again.', scene: { bg: 'day', items: [['hole', 50, 92, 1.4], ['dog', 70, 86, 1.1, { flip: true }], ['question', 40, 50, 1]] } },
      { text: 'It is a big bag!', talk: 'What do you think is in the bag?', scene: { bg: 'day', items: [['dog', 34, 86, 1.1], ['bag', 62, 88, 1.3]] } },
      { text: 'In the bag is a top. Bob got {child} a top!', talk: 'Who would you give a present to?', scene: { bg: 'day', items: [['child', 30, 86, 1], ['dog', 70, 86, 1.1, { flip: true }], ['top', 50, 88, 1]] } },
      { text: 'Pat, pat. Bob is a big, big dog.', talk: 'Tell Bob thank you! What does a happy dog do?', scene: { bg: 'dusk', items: [['child', 40, 86, 1, { pose: 'hug' }], ['dog', 60, 86, 1.2, { flip: true }], ['heart', 50, 34, 0.8]] } },
    ],
  },
  {
    id: 'hen-and-the-hat', step: 8, title: 'Hen and the Hat', theme: ['animals', 'friends'],
    cover: { bg: 'farm', items: [['hat', 50, 88, 1.4, { kind: 'top' }], ['hen', 50, 58, 0.9]] },
    pages: [
      { text: 'Hen has a hat.', talk: 'Point to the hen. Point to the hat.', scene: { bg: 'farm', items: [['hen', 50, 86, 1.4, { hat: true }]] } },
      { text: 'It is a big hat. Hen did a hop in the hat.', talk: 'Can you hop like Hen? Hop, hop!', scene: { bg: 'farm', items: [['hen', 50, 74, 1.4, { hat: true }], ['motion', 50, 90, 1]] } },
      { text: 'Bob the dog can get the hat.', talk: 'Uh oh! What is Bob going to do?', scene: { bg: 'farm', items: [['hen', 30, 86, 1.1, { hat: true }], ['dog', 70, 86, 1.1, { flip: true }]] } },
      { text: 'Bob has the hat! Hen is mad.', talk: 'How does Hen feel? How do you know?', scene: { bg: 'farm', items: [['hen', 30, 86, 1.1, { mood: 'mad' }], ['dog', 66, 86, 1.1, { flip: true, hat: true }]] } },
      { text: 'Bob sat in the hat. The hat is a bed!', talk: 'Is a hat a good bed? What else could be a bed?', scene: { bg: 'farm', items: [['hat', 58, 90, 1.6, { kind: 'topbowl' }], ['dog', 58, 62, 0.9, { pose: 'sleep' }], ['hat', 58, 90, 1.6, { kind: 'topbowl', front: true }], ['hen', 22, 86, 1, { mood: 'mad' }]] } },
      { text: 'Hen can not get the hat.', talk: 'What could Hen do? Should Hen be kind or cross?', scene: { bg: 'farm', items: [['hen', 30, 86, 1.1], ['hat', 64, 90, 1.5, { kind: 'topbowl' }], ['dog', 64, 63, 0.85, { pose: 'sleep' }], ['hat', 64, 90, 1.5, { kind: 'topbowl', front: true }]] } },
      { text: 'Hen and Bob fit in the hat!', talk: 'How did they fix it? Do friends share?', scene: { bg: 'farm', items: [['hat', 50, 90, 1.7, { kind: 'topbowl' }], ['dog', 42, 66, 0.8], ['hen', 60, 64, 0.8], ['hat', 50, 90, 1.7, { kind: 'topbowl', front: true }]] } },
      { text: 'Hen, Bob, and {child} nap in the big hat.', talk: 'Would you fit in a big hat with friends?', scene: { bg: 'night', items: [['moon', 84, 26, 0.8], ['stars', 25, 28, 1], ['hat', 50, 90, 1.8, { kind: 'topbowl' }], ['dog', 40, 62, 0.8, { pose: 'sleep' }], ['child', 52, 60, 0.5, { peek: true, pose: 'sleep' }], ['hen', 64, 62, 0.72, { pose: 'sleep' }], ['hat', 50, 90, 1.8, { kind: 'topbowl', front: true }]] } },
    ],
  },
  {
    id: 'gus-the-mud-pup', step: 10, title: 'Gus the Mud Pup', theme: ['animals', 'outside'],
    cover: { bg: 'day', items: [['mud', 50, 92, 1.4], ['pup', 50, 84, 1.4, { muddy: true }]] },
    pages: [
      { text: 'Gus is a pup.', talk: 'What is a pup? A baby dog! What is a baby cat?', scene: { bg: 'day', items: [['pup', 50, 86, 1.6]] } },
      { text: 'Gus can run in the sun.', talk: 'Run on the spot like Gus!', scene: { bg: 'day', items: [['sun', 80, 26, 1], ['pup', 45, 86, 1.3, { pose: 'run' }], ['motion', 28, 84, 1]] } },
      { text: 'Gus can run and run and run.', talk: 'Where do you like to run?', scene: { bg: 'day', items: [['sun', 80, 26, 1], ['hill', 50, 96, 1.6], ['pup', 60, 80, 1.1, { pose: 'run' }]] } },
      { text: 'Gus hops in the mud.', talk: 'What does mud feel like? Squishy? Cold?', scene: { bg: 'day', items: [['mud', 50, 92, 1.5], ['pup', 50, 80, 1.3, { muddy: true, pose: 'run' }], ['splash', 50, 84, 1.2]] } },
      { text: 'Gus is a mud pup! Gus is a mud bug!', talk: 'Is Gus clean or dirty? What should Gus do?', scene: { bg: 'day', items: [['mud', 50, 92, 1.5], ['pup', 50, 84, 1.4, { muddy: true }]] } },
      { text: 'Get in the tub, Gus.', talk: 'What do you do in the tub?', scene: { bg: 'bath', items: [['pup', 50, 62, 0.9, { muddy: true }], ['tub', 50, 88, 1.5]] } },
      { text: 'Rub, rub, rub. Gus is not a mud pup.', talk: 'Rub your hands like you are washing.', scene: { bg: 'bath', items: [['pup', 50, 62, 0.9], ['tub', 50, 88, 1.5, { bubbles: true }]] } },
      { text: 'Gus and {child} sit on the rug.', talk: 'Where does Gus sleep, do you think?', scene: { bg: 'room', items: [['rug', 50, 90, 1.3], ['child', 40, 86, 1], ['pup', 62, 88, 0.9]] } },
    ],
  },
  {
    id: 'fox-in-a-box', step: 13, title: 'Fox in a Box', theme: ['imagination', 'animals'],
    cover: { bg: 'room', items: [['box', 50, 90, 1.4], ['fox', 50, 66, 0.9, { peek: true }]] },
    pages: [
      { text: 'Fox has a box. It is a big box.', talk: 'What could you do with a big box?', scene: { bg: 'room', items: [['fox', 32, 86, 1.1], ['box', 64, 90, 1.4]] } },
      { text: 'Fox gets in the box. Fox is in the box!', talk: 'Can you fit in a box? Show me how small you can be.', scene: { bg: 'room', items: [['box', 50, 90, 1.4], ['fox', 50, 66, 0.9, { peek: true }]] } },
      { text: 'Is the box a van? Yes! Zip, zip, zip!', talk: 'Where would you drive a van?', scene: { bg: 'day', items: [['box', 50, 88, 1.4, { wheels: true }], ['fox', 50, 64, 0.9, { peek: true }], ['motion', 24, 84, 1]] } },
      { text: 'Is the box a hill? Yes! Fox sits on top.', talk: 'What can you see from the top of a hill?', scene: { bg: 'day', items: [['box', 50, 90, 1.4], ['fox', 50, 58, 1]] } },
      { text: 'Is the box a bed? Yes! Fox naps in the box.', talk: 'What else could the box be? A boat? A house?', scene: { bg: 'night', items: [['box', 50, 90, 1.4], ['fox', 50, 66, 0.9, { peek: true, pose: 'sleep' }], ['moon', 82, 26, 0.8]] } },
      { text: 'A duck quacks. Quack! The duck gets in the box.', talk: 'Quack like the duck! Who else wants a turn?', scene: { bg: 'room', items: [['box', 50, 90, 1.4], ['fox', 42, 66, 0.85, { peek: true }], ['duck', 62, 64, 0.8]] } },
      { text: 'Fox, Duck, and {child} sit in the box. It is a lot of fun!', talk: 'If our bed were a box, where would it go tonight?', scene: { bg: 'room', items: [['box', 50, 90, 1.6], ['fox', 36, 64, 0.8, { peek: true }], ['child', 52, 64, 0.62, { peek: true }], ['duck', 68, 62, 0.75]] } },
    ],
  },
  {
    id: 'the-wish-fish', step: 14, title: 'The Wish Fish', theme: ['water', 'kindness'],
    cover: { bg: 'pond', items: [['fish', 50, 80, 1.5], ['sparkle', 66, 48, 1]] },
    pages: [
      { text: '{child} and {Grownup} sit on the dock.', talk: 'What do you think lives in the water?', scene: { bg: 'pond', items: [['log', 40, 84, 1.3], ['grownup', 30, 80, 0.8], ['child', 48, 80, 0.72]] } },
      { text: 'A fish pops up. It is a red fish.', talk: 'Point to the fish. What colour is it?', scene: { bg: 'pond', items: [['child', 26, 86, 0.9], ['fish', 62, 82, 1.2], ['ripple', 62, 86, 1.2]] } },
      { text: '"I am a wish fish," said the fish. "You get a wish!"', talk: 'If a fish could talk, what would it say to you?', scene: { bg: 'pond', items: [['child', 26, 86, 0.9], ['fish', 62, 80, 1.2], ['sparkle', 72, 50, 1]] } },
      { text: '{child} can wish for a ship. A big red ship!', talk: 'Where would you sail a big red ship?', scene: { bg: 'sea', items: [['ship', 50, 76, 1.6], ['sun', 82, 24, 0.8]] } },
      { text: 'Or {child} can wish for a shop. A shop of hats!', talk: 'What kind of shop would you want?', scene: { bg: 'room', items: [['hat', 26, 80, 0.8, { kind: 'cap' }], ['hat', 50, 80, 0.9], ['hat', 74, 80, 0.8, { kind: 'cap' }], ['child', 88, 88, 0.7]] } },
      { text: 'Or a big dish of jam!', talk: 'What is your favourite thing to eat?', scene: { bg: 'kitchen', items: [['bowl', 50, 86, 1.7], ['sparkle', 70, 40, 0.8]] } },
      { text: '{child} has a wish. "I wish the fish can go back to its mom."', talk: 'Why do you think that was the wish?', scene: { bg: 'pond', items: [['child', 30, 86, 0.95], ['fish', 60, 82, 1], ['heart', 46, 40, 0.7]] } },
      { text: 'Off it zips, up and down, to its mom. Hush, wish fish. Hush, {child}.', talk: 'Make a quiet wish for tomorrow.', scene: { bg: 'dusk', items: [['fish', 40, 84, 0.9], ['fish', 60, 82, 1.3], ['ripple', 50, 88, 1.4], ['moon', 82, 26, 0.7]] } },
    ],
  },
  {
    id: 'ship-in-the-bath', step: 16, title: 'The Ship in the Bath', theme: ['home', 'water'],
    cover: { bg: 'bath', items: [['ship', 50, 53, 1.1], ['tub', 50, 88, 1.6, { bubbles: true }]] },
    pages: [
      { text: '{child} gets in the bath.', talk: 'What do you like best about bath time?', scene: { bg: 'bath', items: [['child', 50, 62, 0.75, { peek: true }], ['tub', 50, 88, 1.6, { bubbles: true }]] } },
      { text: 'In the bath is a ship, a fish, and a duck.', talk: 'Point to the ship. The fish. The duck!', scene: { bg: 'bath', items: [['ship', 34, 53, 0.75], ['fish', 52, 54, 0.65], ['duck', 68, 53, 0.7], ['tub', 50, 88, 1.6]] } },
      { text: 'The ship can rock. Rock, rock, rock.', talk: 'Rock side to side like the ship!', scene: { bg: 'bath', items: [['ship', 50, 53, 1.05, { tilt: true }], ['tub', 50, 88, 1.6], ['motion', 30, 46, 1]] } },
      { text: 'The duck can quack. Quack, quack!', talk: 'What sounds can you make in the bath?', scene: { bg: 'bath', items: [['duck', 50, 53, 1.2], ['tub', 50, 88, 1.6]] } },
      { text: 'The fish has a wish.', talk: 'Ask: What do you think the fish wishes for?', scene: { bg: 'bath', items: [['fish', 50, 54, 1.1], ['tub', 50, 88, 1.6], ['sparkle', 66, 34, 1]] } },
      { text: 'The fish wants to be a ship.', talk: 'If you could be anything, what would you be?', scene: { bg: 'bath', items: [['fish', 40, 54, 0.95], ['tub', 50, 88, 1.6], ['thought', 66, 26, 1, { of: 'ship' }]] } },
      { text: 'Chug, chug, chug! The fish is a ship!', talk: 'Chug your arms like a ship! Where is it going?', scene: { bg: 'bath', items: [['fish', 50, 54, 1, { sail: true }], ['tub', 50, 88, 1.6, { bubbles: true }], ['motion', 26, 46, 1]] } },
      { text: 'Hush. The bath is over. Rub-a-dub-dub!', talk: 'What do we do after a bath?', scene: { bg: 'night', items: [['towel', 50, 88, 1.2], ['child', 50, 86, 1, { towel: true }], ['moon', 84, 26, 0.8]] } },
    ],
  },
  {
    id: 'frog-on-a-log', step: 18, title: 'Frog on a Log', theme: ['animals', 'water'],
    cover: { bg: 'pond', items: [['log', 50, 84, 1.4], ['frog', 50, 72, 1.2]] },
    pages: [
      { text: 'Frog sits on a log in the pond.', talk: 'What else lives in a pond?', scene: { bg: 'pond', items: [['log', 50, 84, 1.4], ['frog', 50, 72, 1.1]] } },
      { text: 'Frog can jump. Jump, Frog, jump!', talk: 'Stand up and jump like a frog!', scene: { bg: 'pond', items: [['log', 30, 84, 1.1], ['frog', 55, 50, 1.1, { pose: 'jump' }], ['motion', 40, 64, 1]] } },
      { text: 'Frog lands on a big flat rock.', talk: 'Where did Frog land? Was it a big jump?', scene: { bg: 'pond', items: [['rock', 60, 86, 1.4], ['frog', 60, 74, 1]] } },
      { text: 'Then Frog swims. Swim, swim, swim!', talk: 'Swim with your arms! Can you swim?', scene: { bg: 'pond', items: [['frog', 50, 80, 1.1, { pose: 'swim' }], ['ripple', 50, 86, 1.4]] } },
      { text: 'A fish swims up. Fish and Frog swim and swim.', talk: 'Are Fish and Frog friends? How can you tell?', scene: { bg: 'pond', items: [['frog', 38, 80, 1, { pose: 'swim' }], ['fish', 64, 82, 0.9], ['ripple', 50, 86, 1.6]] } },
      { text: 'When the sun sets, Frog sings a song.', talk: 'What song would a frog sing? Can you sing it?', scene: { bg: 'dusk', items: [['log', 50, 84, 1.4], ['frog', 50, 72, 1.1, { pose: 'sing' }], ['notes', 66, 50, 1]] } },
      { text: 'Frog sings to {child}.', talk: 'Sing a little song back to Frog.', scene: { bg: 'dusk', items: [['child', 30, 86, 1], ['log', 62, 84, 1.2], ['frog', 62, 72, 1, { pose: 'sing', flip: true }], ['notes', 46, 48, 1]] } },
      { text: 'Then Frog has a long nap on the log.', talk: 'Where do frogs sleep? Where do you sleep?', scene: { bg: 'night', items: [['log', 50, 84, 1.4], ['frog', 50, 72, 1.1, { pose: 'sleep' }], ['moon', 82, 26, 0.9], ['stars', 26, 26, 1]] } },
    ],
  },
  {
    id: 'a-cake-for-child', step: 21, title: 'A Cake for {child}', theme: ['family', 'food'],
    cover: { bg: 'kitchen', items: [['cake', 50, 86, 1.6]] },
    pages: [
      { text: '{Grownup} and {child} bake a cake.', talk: 'What do we need to bake a cake?', scene: { bg: 'kitchen', items: [['grownup', 34, 86, 1], ['child', 56, 86, 0.9], ['bowl', 74, 86, 0.9]] } },
      { text: 'Mix it up! Mix, mix, mix.', talk: 'Stir the air with a pretend spoon!', scene: { bg: 'kitchen', items: [['bowl', 50, 86, 1.6, { stir: true }], ['motion', 70, 60, 1]] } },
      { text: 'Fox comes in. Fox likes cake.', talk: 'Why do you think Fox came?', scene: { bg: 'kitchen', items: [['child', 30, 86, 0.9], ['bowl', 50, 86, 1], ['fox', 72, 86, 1, { flip: true }]] } },
      { text: 'Fox wants a bite. "Not yet, Fox!"', talk: 'Is it hard to wait? What helps you wait?', scene: { bg: 'kitchen', items: [['fox', 40, 86, 1.2, { mood: 'hopeful' }], ['bowl', 66, 86, 1]] } },
      { text: 'Take a nap, Fox. Cake takes time.', talk: 'How long do you think the cake will take?', scene: { bg: 'kitchen', items: [['oven', 60, 88, 1.3], ['fox', 28, 88, 0.9, { pose: 'sleep' }]] } },
      { text: 'Ding! Here is the cake!', talk: 'What does a cake smell like?', scene: { bg: 'kitchen', items: [['cake', 50, 86, 1.5], ['sparkle', 70, 40, 1], ['sparkle', 30, 46, 0.7]] } },
      { text: 'It has a pink rose on top.', talk: 'What would you put on top of your cake?', scene: { bg: 'kitchen', items: [['cake', 50, 86, 1.7, { rose: true }]] } },
      { text: 'A bit for Fox, a bit for {Grownup}, and a bit for {child}. Yum!', talk: 'Who would you share a cake with?', scene: { bg: 'kitchen', items: [['fox', 24, 86, 0.9], ['cake', 50, 86, 1.1, { rose: true }], ['grownup', 70, 86, 0.95], ['child', 86, 86, 0.8]] } },
    ],
  },
  {
    id: 'the-green-boat', step: 25, title: 'The Green Boat', theme: ['water', 'family'],
    cover: { bg: 'sea', items: [['boat', 50, 76, 1.5]] },
    pages: [
      { text: '{child} and {Grownup} go to the sea.', talk: 'Have we been to the sea, a lake, or a river?', scene: { bg: 'beach', items: [['grownup', 36, 88, 1], ['child', 56, 88, 0.9], ['sun', 82, 24, 0.9]] } },
      { text: 'They see a boat. It is green and white.', talk: 'Point to green. Point to white.', scene: { bg: 'beach', items: [['boat', 60, 80, 1.3], ['child', 26, 88, 0.85]] } },
      { text: 'They get in the boat. Row, row, row!', talk: 'Row with me! Row, row, row!', scene: { bg: 'sea', items: [['boat', 50, 76, 1.5, { riders: true }]] } },
      { text: 'A seal pops up to say hi.', talk: 'Wave hi to the seal! What would a seal say?', scene: { bg: 'sea', items: [['boat', 34, 76, 1.2, { riders: true }], ['seal', 70, 80, 1]] } },
      { text: 'Then the rain comes. Drip, drip, drop.', talk: 'Make rain with your fingers on my arm.', scene: { bg: 'rain', items: [['boat', 50, 76, 1.4, { riders: true }], ['cloud', 30, 26, 1], ['cloud', 68, 22, 0.9]] } },
      { text: 'The rain stops. {child} sees a rainbow.', talk: 'What colours are in a rainbow?', scene: { bg: 'sea', items: [['rainbow', 50, 60, 0.95], ['boat', 50, 78, 1.2, { riders: true }]] } },
      { text: 'Row home, {child}. It was a big day.', talk: 'What was the best part of the day?', scene: { bg: 'dusk', items: [['boat', 50, 78, 1.3, { riders: true }], ['house', 82, 84, 0.8]] } },
    ],
  },
  {
    id: 'fox-and-the-moon', step: 30, title: 'Fox and the Moon', theme: ['space', 'imagination'],
    cover: { bg: 'night', items: [['moon', 50, 40, 1.6], ['fox', 50, 88, 1]] },
    pages: [
      { text: 'It is night. The sky is dark.', talk: 'What do you see in the sky at night?', scene: { bg: 'night', items: [['house', 26, 88, 1], ['stars', 60, 26, 1.3], ['moon', 80, 30, 0.9]] } },
      { text: 'Fox looks up at the moon.', talk: 'What shape is the moon tonight?', scene: { bg: 'night', items: [['fox', 40, 88, 1.2, { pose: 'look' }], ['moon', 72, 28, 1.1]] } },
      { text: '"I wish I could go to the moon," said Fox.', talk: 'Would you like to go to the moon? Why?', scene: { bg: 'night', items: [['fox', 40, 88, 1.2, { pose: 'look' }], ['moon', 72, 28, 1.1], ['sparkle', 56, 40, 0.8]] } },
      { text: 'Fox gets a box, a pot, and a long string.', talk: 'What do you think Fox will make?', scene: { bg: 'room', items: [['box', 30, 90, 1], ['pan', 52, 88, 0.9], ['string', 72, 88, 1], ['fox', 86, 88, 0.8, { flip: true }]] } },
      { text: 'Fox makes a ship for the stars.', talk: 'How would you build a ship to the stars?', scene: { bg: 'night', items: [['rocket', 50, 88, 1.4], ['fox', 76, 88, 0.8, { flip: true }]] } },
      { text: 'Zoom! Up, up, up goes Fox.', talk: 'Count down with me: 3, 2, 1… zoom!', scene: { bg: 'space', items: [['rocket', 50, 70, 1.3, { flying: true, fox: true }], ['stars', 24, 26, 1.2]] } },
      { text: 'The moon is soft and white. Fox sits on it.', talk: 'What do you think the moon feels like?', scene: { bg: 'space', items: [['moon', 50, 74, 2.4, { ground: true }], ['fox', 50, 56, 0.9], ['earth', 82, 24, 0.7]] } },
      { text: 'Then Fox floats home to bed. Goodnight, Fox. Goodnight, {child}.', talk: 'Say goodnight to Fox. What will you dream about?', scene: { bg: 'night', items: [['bed', 50, 88, 1.3, { fox: true }], ['moon', 82, 26, 0.9], ['stars', 26, 26, 1]] } },
    ],
  },
  {
    id: 'snow-day', step: 34, title: 'Snow Day', theme: ['family', 'seasons'],
    cover: { bg: 'snow', items: [['snowman', 50, 88, 1.5, { hat: true }]] },
    pages: [
      { text: 'Snow falls all night. In the morning, the town is white.', talk: 'Have you seen snow? What colour is it?', scene: { bg: 'snow', items: [['house', 30, 86, 1], ['house', 66, 86, 0.8], ['snowflakes', 50, 30, 1]] } },
      { text: '{child} jumps out of bed and shouts, "Snow!"', talk: 'What do you shout when you are excited?', scene: { bg: 'room', items: [['bed', 40, 88, 1.1], ['child', 66, 82, 1, { pose: 'jump' }], ['window', 22, 50, 0.9, { snow: true }]] } },
      { text: '{child} puts on a coat, a hat, and boots.', talk: 'What do you wear when it is cold?', scene: { bg: 'room', items: [['child', 50, 86, 1.2, { coat: true }]] } },
      { text: 'Out they go. Crunch, crunch, crunch!', talk: 'Stomp your feet: crunch, crunch!', scene: { bg: 'snow', items: [['grownup', 40, 86, 1, { coat: true }], ['child', 60, 86, 0.9, { coat: true }], ['snowflakes', 50, 26, 1]] } },
      { text: '{child} and {Grownup} roll a big snowball.', talk: 'Roll your hands like you are making a snowball.', scene: { bg: 'snow', items: [['child', 34, 86, 0.9, { coat: true }], ['snowball', 58, 88, 1.3], ['grownup', 80, 86, 0.95, { coat: true, flip: true }]] } },
      { text: 'They roll and roll and make a snowman.', talk: 'How many snowballs make a snowman?', scene: { bg: 'snow', items: [['snowman', 55, 88, 1.4], ['child', 28, 86, 0.9, { coat: true }]] } },
      { text: 'The snowman needs a hat. {child} gives him a red hat.', talk: 'What else could the snowman wear?', scene: { bg: 'snow', items: [['snowman', 55, 88, 1.4, { hat: true }], ['child', 28, 86, 0.9, { coat: true, pose: 'wave' }]] } },
      { text: '{child} hugged {Grownup}. What a good snow day!', talk: 'What was your favourite part of the story?', scene: { bg: 'snow', items: [['snowman', 74, 88, 1.1, { hat: true }], ['grownup', 38, 86, 1, { coat: true, pose: 'hug' }], ['child', 52, 86, 0.9, { coat: true, pose: 'hug' }], ['heart', 46, 18, 0.8]] } },
    ],
  },
  {
    id: 'little-owl', step: 37, title: "Little Owl Can't Sleep", theme: ['bedtime', 'animals'],
    cover: { bg: 'night', items: [['tree', 50, 92, 1.7, { owls: true }], ['moon', 80, 22, 0.9]] },
    pages: [
      { text: 'Little Owl was wide awake.', talk: 'Are you sleepy or wide awake right now?', scene: { bg: 'night', items: [['branch', 50, 70, 1.5], ['owl', 50, 62, 0.9, { little: true }], ['moon', 82, 24, 0.8]] } },
      { text: '"I cannot sleep," said Little Owl. "The night is so big."', talk: 'What do you do when you cannot sleep?', scene: { bg: 'night', items: [['branch', 50, 70, 1.5], ['owl', 50, 62, 0.9, { little: true, mood: 'worried' }], ['stars', 24, 24, 1.2]] } },
      { text: 'Big Owl gave Little Owl a hug. "Let\'s count the stars."', talk: 'Who gives you hugs when you need them?', scene: { bg: 'night', items: [['branch', 50, 72, 1.6], ['owl', 40, 62, 1.2], ['owl', 58, 62, 0.8, { little: true }], ['heart', 50, 30, 0.7]] } },
      { text: 'One, two, three. The stars twinkled like candles.', talk: 'Let\'s count the stars on this page together.', scene: { bg: 'night', items: [['stars', 50, 30, 1.6], ['branch', 50, 76, 1.5], ['owl', 42, 68, 1], ['owl', 58, 68, 0.7, { little: true }]] } },
      { text: '"Hush," said Big Owl. "The wind is singing a little song just for you."', talk: 'What do you think the wind\'s song sounds like? Hum it.', scene: { bg: 'night', items: [['wind', 50, 40, 1.4], ['branch', 50, 76, 1.5], ['owl', 42, 68, 1], ['owl', 58, 68, 0.7, { little: true }]] } },
      { text: 'Little Owl snuggled under Big Owl\'s wing.', talk: 'Snuggle in close, like Little Owl.', scene: { bg: 'night', items: [['branch', 50, 74, 1.5], ['owl', 50, 64, 1.3, { snuggle: true }]] } },
      { text: 'The moon was a soft yellow lamp.', talk: 'What makes your room feel safe at night?', scene: { bg: 'night', items: [['moon', 50, 40, 1.6, { glow: true }], ['tree', 20, 92, 1.1], ['tree', 82, 92, 0.9]] } },
      { text: 'And Little Owl fell asleep. Goodnight, Little Owl. Goodnight, {child}.', talk: 'Whisper goodnight to Little Owl.', scene: { bg: 'night', items: [['branch', 50, 74, 1.5], ['owl', 50, 64, 1.3, { snuggle: true, pose: 'sleep' }], ['moon', 82, 24, 0.8], ['stars', 24, 24, 1]] } },
    ],
  },
];

export const storyById = id => STORIES.find(s => s.id === id);
