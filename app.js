const fs = require("fs");
const mergeImg = require('merge-img');
//const pixelart = require("pixelart");
const outputFolder = "./generated_faces";
const outputCharacterJSON = "./generated_faces/characters.json";
const outputAttributesJS = "./generated_faces/attributes.json";

const desiredCount = 10000;
const totalFaces = 89820;

const ext = ".png";
const partFolder = "./face_parts";


let attributescount = {
  "face":{
    "Martian":0,
    "Zombie":0,
    "Neptunite":0
  },
  "mouth":{
    "Buck Teeth":0,"Medical Mask":0,"Smile":0,"Frown":0,"Front Beard":0,"Pipe":0,"Black Lipstick":0,"Purple Lipstick":0,"Hot Lipstick":0,"Cigarette":0
  },
  "nose":{
    "clown nose":0
  },
  "eyes":{
    "Welding Goggles":0, "Purple Eye Shadow":0,"Blue Eye Shadow":0,"Green Eye Shadow":0,"VR":0,"Small Shades":0,"Clown Eyes Green":0,"Clown Eyes Blue":0,"Eye Patch":0,"Classic Shades":0,"Regular Shades":0,"Horned Rim Glasses":0,"Big Shades":0,"Nerd Glasses":0,"Mayfair goggles":0,"RED":0,"eye mask":0
  },
  "ears":{
    "earring":0
  },
  "hat":{
    "Pilot Helmet":0,"Santa":0,"Tiara":0,"Top":0,"Cowboy":0,"Fedora":0,"Police":0,"Clown":0,"Cap Forward":0,"Hoodie":0,"Shaved Head":0,"Cap":0,"Headband":0,"Knitted":0,"Bandana":0,"Monkeycap":0,"Do rag":0
  },
  "hair":{
    "Frumpy Hair":0,"Orange Side":0,"Purple Hair":0,"Pigtails black":0,"Mohawk":0,"Wild Blonde":0,"Pigtails brown":0,"Pink With Hat":0,"Straight Hair Blonde":0,"Red Mohawk":0,"Half Shaved":0,"Blonde Bob":0,"Wild White Hair":0,"Vampire Hair":0,"Blonde Short":0,"Clown Hair Green":0,"Straight Hair Dark":0,"Straight Hair":0,"Dark Hair":0,"Peak Spike":0,"Crazy Hair":0,"Mohawk Dark":0,"Mohawk":0,"Mohawk Thin":0,"Wild Hair":0,"Messy Hair":0,"Stringy Hair":0,"Headphone":0
  },
  "beard":{
    "Big Beard":0,"Front Beard Dark":0,"Chinstrap":0,"Luxurious Beard":0,"Normal Beard Black":0,"Normal Beard":0,"Goatie":0,"Muttonchops":0,"Shadow Beard":0
  },
  "necklace":{
    "Choker":0,"Silver Chain":0,"Gold Chain":0
  },
  "moustache":{
    "Handlebars":0
  },
  "vape":{
    "vape":0
  },
  "mole":{
    "mole":0
  }
}

const partTypes = [
  { name: "face/face",id:"face",   count: 7,  offset: {x:    0, y: 0}, attrNames: ["Martian","Zombie","ofm","ofm","ofm","ofm","Neptunite"], attrSex: ["martian", "z","ofm","ofm","ofm","ofm","n"], validcounts:[21,91,"NONE","NONE","NONE","NONE",61], required: true },
  { name: "facetype/facetype",id:"facetype",      count: 2,  offset: {x: -560, y: 0}, attrNames: ["Rosy Cheeks","Spots"], attrSex: ["u","u"],validcounts:[128,124], required: false },
  { name: "mouth/m",id:"mouth",     count: 9,  offset: {x: -560, y: 0}, attrNames: ["Buck Teeth","Medical Mask","Smile","Frown","Pipe","Black Lipstick","Purple Lipstick","Hot Lipstick","Cigarette"], attrSex: ["u", "u","u","u","u","f","f","f","u"], validcounts:[78,175,212,260,303,535,617,644,961],required: true },
  { name: "nose/n", id:"nose",     count: 1,  offset: {x: -560, y: 0}, attrNames: ["clown nose"], attrSex: ["u"],validcounts:[203], required: false },
  { name: "eyes/eyes",id:"eyes",   count: 17,  offset: {x: -560, y: 0}, attrNames: ["Welding Goggles", "Purple Eye Shadow","Blue Eye Shadow","Green Eye Shadow","VR","Small Shades","Clown Eyes Green","Clown Eyes Blue","Eye Patch","Classic Shades","Regular Shades","Horned Rim Glasses","Big Shades","Nerd Glasses","Mayfair goggles","RED","eye mask"], attrSex: ["u", "u","f","f","u","u","u","u","u","u","u","u","u","u","omn","z","u"],validcounts:[86,261,263,266,303,332,351,378,447,463,502,526,527,535,23,91,292], required: true },
  { name: "hair/hair",id:"hair",   count: 45,  offset: {x: -560, y: 0}, attrNames: ["Frumpy Hair","Orange Side","Purple Hair","Pigtails black","Mohawk","Wild Blonde","Pigtails brown","Pink With Hat","Straight Hair Blonde","Red Mohawk","Half Shaved","Blonde Bob","Wild White Hair","Vampire Hair","Blonde Short","Clown Hair Green","Straight Hair Dark","Straight Hair","Dark Hair","Peak Spike","Crazy Hair","Mohawk Dark","Mohawk","Mohawk Thin","Wild Hair","Messy Hair","Stringy Hair","Headphone","Pilot Helmet","Santa","Tiara","Top","Cowboy","Fedora","Police","Clown","Cap Forward","Hoodie","Shaved Head","Cap","Headband","Knitted","Bandana","Monkeycap","Do rag"], attrSex: ["nf", "f","f","f","u","f","f","f","f","u","f","f","f","nf","f","u","f","f","f","nf","u","u","u","u","u","u","u","u","nf", "nf","nf","nf","nf","nf","nf","nf","nf","nf","nf","nf","nf","nf","nf","nf","nf"],validcounts:[441,68,165,47,419,144,47,95,144,147,147,147,136,147,129,148,148,151,157,300,384,414,419,429,441,442,460,82,54,44,55,115,142,178,186,203,238,254,295,317,382,406,461,432,287], required: true },
  { name: "ears/ears",id:"ears",   count: 1,  offset: {x: -560, y: 0}, attrNames: ["earring"], attrSex: ["u"],validcounts:[987], required: false },
  { name: "hat/hat",id:"hat",   count:8,  offset: {x: -560, y: 0}, attrNames: ["Pilot Helmet","Tiara","Clown","Hoodie","Shaved Head","Headband","Knitted","Bandana"], attrSex: ["f","f","f","f","f","f","f","f"],validcounts:[54,55,148,254,295,382,406,461], required: false },
  { name: "beard/beard",id:"beard",      count: 10,  offset: {x: -560, y: 0}, attrNames: ["Big Beard","Front Beard Dark","Front Beard","Chinstrap","Luxurious Beard","Normal Beard Black","Normal Beard","Goatie","Muttonchops","Shadow Beard"], attrSex: ["nf","nf","nf","nf","nf","nf","nf","nf","nf","nf"],validcounts:[146,259,272,273,286,288,289,293,300,481], required: false },
  { name: "necklace/necklace",id:"necklace",      count: 3,  offset: {x: -560, y: 0}, attrNames: ["Choker","Silver Chain","Gold Chain"], attrSex: ["f","u","u"],validcounts:[48,156,169], required: false },
  { name: "moustache/moustache",id:"moustache",      count: 1,  offset: {x: -560, y: 0}, attrNames: ["Handlebars"], attrSex: ["nf"],validcounts:[262], required: false },
  { name: "vape/v",id:"vape",      count: 1,  offset: {x: -560, y: 0}, attrNames: ["vape"], attrSex: ["u"],validcounts:[271], required: false },
  { name: "mole/mole",id:"mole",      count: 1,  offset: {x: -560, y: 0}, attrNames: ["mole"], attrSex: ["u"],validcounts:[572], required: false }


  ];

// nf,f,u,m,omn,z

// nofemale, female, all,male,onlymartiansneptunites,allzombies

// PARTS = {
//   face:  { required: true,
//            attributes: [['', 'u'],
//                         ['', 'u']] },
//   mouth: { required: true,
//            attributes: [['Black Lipstick',  'f'],
//                         ['Red Lipstick',    'f'],
//                         ['Smile',           'u'],
//                         ['',                'u'],
//                         ['Teeth Smile',     'm'],
//                         ['Purple Lipstick', 'f']] },
//   nose:  { required: true,
//            attributes: [['',          'u'],
//                         ['Nose Ring', 'u']] },
//   eyes:  { required: true,
//            attributes: [['',              'u'],
//                         ['Asian Eyes',    'u'],
//                         ['Sun Glasses',   'u'],
//                         ['Red Glasses',   'u'],
//                         ['Round Eyes',    'u']] },
//   ears:  { required: true,
//            attributes: [['',              'u'],
//                         ['Left Earring',  'u'],
//                         ['Right Earring', 'u'],
//                         ['Two Earrings',  'u']] },
//   beard: { required: false,
//            attributes: [['Brown Beard',     'm'],
//                         ['Mustache-Beard',  'm'],
//                         ['Mustache',        'm'],
//                         ['Regular Beard',   'm']] },
//   hair:  { required: false,
//            attributes: [['Up Hair',        'm'],
//                         ['Down Hair',      'u'],
//                         ['Mahawk',         'u'],
//                         ['Red Mahawk',     'u'],
//                         ['Orange Hair',    'u'],
//                         ['Bubble Hair',    'm'],
//                         ['Emo Hair',       'u'],
//                         ['Thin Hair',      'm'],
//                         ['Bald',           'm'],
//                         ['Blonde Hair',    'f'],
//                         ['Caret Hair',     'f'],
//                         ['Pony Tails'      'f']] }
// }



function checkAttributeCompatibility(codeArr) {
  let blondeHair = false;
  let earring = false;
  for (let i=0; i<partTypes.length; i++) {
    if ((partTypes[i].name == "hair/hair") && (codeArr[i] == 10))
      blondeHair = true;
    if ((partTypes[i].name == "ears/ears") && (codeArr[i] >= 2))
      earring = true;
  }

  if (earring && blondeHair) return false;
  return true;
}


function mergeImagesToPng(images, output) {
  return new Promise(function(resolve, reject) {
    mergeImg(images)
    .then((img) => {
      // Save image as file
      img.write(output, () => {
        console.log(`Image ${output} saved`);
        resolve();
      });
    });
    // resolve();
  });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function detectGender(codeArr) {

  // console.log("codeArr-----------------------------------");
  // console.log(codeArr);

  let male = false;
  let female = false;
  let martian = false;
  let neptunite = false;
  let zombie = false;

  let nofemale = false;
  let onlyfemalemale = false;
  let All = false;
  
  let onlymartiansneptunites = false;
  for (let i=0; i < partTypes.length; i++) {
    if (codeArr[i] != 0) {
      const attrGender = partTypes[i].attrSex[codeArr[i]-1];
      if (attrGender == "m") male = true;
      if (attrGender == "f") female = true;
      if (attrGender == "martian") martian = true;
      if (attrGender == "n") neptunite = true;
      if (attrGender == "z") zombie = true;

      if (attrGender == "nf") nofemale = true;
      
      if (attrGender == "omn") onlymartiansneptunites = true;
      if (attrGender == "ofm") onlyfemalemale = true;
      if (attrGender == "u") All = true;
    }
  }
  // console.log("codeArr",codeArr)
  // console.log("male",male);
  // console.log("female",female);
  // console.log("martian",martian);
  // console.log("neptunite",neptunite);
  // console.log("zombie",zombie);
  // console.log("onlymartiansneptunites",onlymartiansneptunites);
  // console.log("onlyfemalemale",onlyfemalemale)

  if (male && female) return "Invalid";
  if(male){
    console.log(1)
    if(female || martian || neptunite || zombie || onlymartiansneptunites){
        return "Invalid";
    }
  }
  if(female){
    console.log(2)
    if(male || martian || neptunite || zombie || onlymartiansneptunites || nofemale){
        return "Invalid";
    }
  }
  if(martian){
    console.log(3)
    if(male || female || neptunite || zombie || onlyfemalemale){
        return "Invalid";
    }
  }
  if(neptunite){
    console.log(4)
    if(male || female || martian || zombie || onlyfemalemale){
        return "Invalid";
    }
  }
  if(zombie){
    console.log(5)
    if(male || female || martian || neptunite || onlyfemalemale || onlymartiansneptunites){
        return "Invalid";
    }
  }
  if (nofemale && female) return "Invalid";
  if (martian && onlyfemalemale) return "Invalid";
  if (neptunite && onlyfemalemale) return "Invalid";
  if (zombie && onlyfemalemale) return "Invalid";
  if (nofemale && onlyfemalemale) return "Invalid";
  if (onlymartiansneptunites && onlyfemalemale) return "Invalid";
  if (onlymartiansneptunites && male) return "Invalid";
   if (onlymartiansneptunites && female) return "Invalid";
   if (onlymartiansneptunites && zombie) return "Invalid";
   if (onlymartiansneptunites && onlyfemalemale) return "Invalid";
  if (male) return "m";
  if (female) return "f";
  if (martian) return "martian";
  if (neptunite) return "n";
  if (zombie) return "z";

  if (nofemale){ return "m"};
  if (onlymartiansneptunites){ return "martian";}
  if (onlyfemalemale){ return "f";};


//console.log("----------------------------------------------------")
 // if (getRandomInt(100) > 50) return "Female";
   return "Invalid";
}

async function saveFaceByCode(codeArr, outFile) {
  let images = [];
  for (let i=0; i < partTypes.length; i++) {
    if (codeArr[i] != 0) {
      const img = {
        src: `${partFolder}/${partTypes[i].name}${codeArr[i]}${ext}`,
        offsetX: partTypes[i].offset.x,
        offsetY: partTypes[i].offset.y,
      }
      images.push(img);
    }
  }

  // Generate image
  await mergeImagesToPng(images, outFile);
}


// new code starts here
// function generatePunk(codes) {
//   let punk = new Pixelart.Image(56, 56);

//   PARTS.forEach(([key, part], i) => {
//     let attribute, path, part;
//     let code = codes[i];

//     if (code != 0) {
//       //# for debugging print attributes with names (size not 0, that is, "")
//       attribute = part.attributes[code - 1];

//       if (attribute[0].size > 0) {
//         console.log(`${key}${code} - ${attribute[0]} (${attribute[1]})`)
//       };

//       //# compose parts on top (from face to accessoire)
//       path = `./i/parts/${key}/${key}${code}.png`;
//       part = Pixelart.Image.read(path);
//       return punk.compose(part)
//     }
// });
// new code ends here



async function generateFaces() {

  // Array that lists all characters
  let characters = [];

  // Save attributes and generate map of attributes to saved array index
  let attrArray = [];
  let attrMap = {};
  let attrFreq = {};
  let attrCount = 0;
  for (let i=0; i < partTypes.length; i++) {
    for (let j=1; j<=partTypes[i].count; j++) {
      if (partTypes[i].attrNames[j-1].length > 0) {
        attrArray.push(partTypes[i].attrNames[j-1]);
        attrMap[partTypes[i].attrNames[j-1]] = attrCount;
        attrFreq[partTypes[i].attrNames[j-1]] = 0;
        attrCount++;
      }
    }
  }
  let attrjs = `const attributes = ${JSON.stringify(attrArray)};`;
  attrjs += "\n\nmodule.exports.attributes = attributes;";
  fs.writeFileSync(outputAttributesJS, attrjs);

  // "Code array" contains the code of current "face"
  // Initialize it to the first "face"
  let codeArr = [];
  for (let i=0; i < partTypes.length; i++) {
    if (partTypes[i].required) 
      codeArr.push(1);
    else
      codeArr.push(0);
  }
  let imgCount = 0;

  // In the loop generate faces and increase the code by one
  let exhausted = false;
  let countarray = {
    "female":{
              "count":0,
              "data":[],
              "attributescount":{
                                  "face":[0,0,0],
                                  "mouth":[0,0,0,0,0,0,0,0,0],
                                  "nose":[0],
                                  "eyes":[0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                                  "facetype":[0,0],
                                  "ears":[0],
                                  "hat":[0,0,0,0,0,0,0,0],
                                  "hair":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                                  "beard":[0,0,0,0,0,0,0,0,0,0],
                                  "necklace":[0,0,0],
                                  "moustache":[0],
                                  "vape":[0],
                                  "mole":[0]
                            }
},
            "male":{
              "count":0,
              "data":[],
               "attributescount":{
                                 "face":[0,0,0],
                                  "mouth":[0,0,0,0,0,0,0,0,0],
                                  "nose":[0],
                                  "eyes":[0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                                  "facetype":[0,0],
                                  "ears":[0],
                                  "hat":[0,0,0,0,0,0,0,0],
                                  "hair":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                                  "beard":[0,0,0,0,0,0,0,0,0,0],
                                  "necklace":[0,0,0],
                                  "moustache":[0],
                                  "vape":[0],
                                  "mole":[0]
                            }
            },
            "martian":{
              "count":0,
              "data":[],
               "attributescount":{
                                  "face":[0,0,0],
                                  "mouth":[0,0,0,0,0,0,0,0,0],
                                  "nose":[0],
                                  "eyes":[0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                                  "facetype":[0,0],
                                  "ears":[0],
                                  "hat":[0,0,0,0,0,0,0,0],
                                  "hair":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                                  "beard":[0,0,0,0,0,0,0,0,0,0],
                                  "necklace":[0,0,0],
                                  "moustache":[0],
                                  "vape":[0],
                                  "mole":[0]
                            }
            },
            "neptunite":{
              "count":0,
              "data":[],
               "attributescount":{
                                  "face":[0,0,0],
                                  "mouth":[0,0,0,0,0,0,0,0,0],
                                  "nose":[0],
                                  "eyes":[0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                                  "facetype":[0,0],
                                  "ears":[0],
                                  "hat":[0,0,0,0,0,0,0,0],
                                  "hair":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                                  "beard":[0,0,0,0,0,0,0,0,0,0],
                                  "necklace":[0,0,0],
                                  "moustache":[0],
                                  "vape":[0],
                                  "mole":[0]
                            }
            },
            "zombie":{
              "count":0,
              "data":[],
               "attributescount":{
                                  "face":[0,0,0],
                                  "mouth":[0,0,0,0,0,0,0,0,0],
                                  "nose":[0],
                                  "eyes":[0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                                  "facetype":[0,0],
                                  "ears":[0],
                                  "hat":[0,0,0,0,0,0,0,0],
                                  "hair":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                                  "beard":[0,0,0,0,0,0,0,0,0,0],
                                  "necklace":[0,0,0],
                                  "moustache":[0],
                                  "vape":[0],
                                  "mole":[0]
                            }
            }
};
  while (!exhausted) {
    // Check if combination is valid
    let gender = detectGender(codeArr);
    console.log(gender);
    let valid = checkAttributeCompatibility(codeArr,gender);

    // Skip faces randomly to get close to desired count
    const r = (getRandomInt(1000)+1)/1200;
    // const r = 0;
    
   
      
       
    if ((r <= desiredCount/totalFaces) && (gender != "Invalid") && (valid)) {
      // Generate and save current face
      if(gender == "m"){
        gender = "male";
        if(countarray.male.count<5596 && valid){
          for(var i=0;i<codeArr.length;i++){
              if(partTypes[i].id!="face" && codeArr[i]!=0){

                console.log("codeArr",codeArr);
                console.log("codeArr[i]-1",codeArr[i]-1)
                console.log("partTypes[i].validcounts",partTypes[i].validcounts)
                console.log("partTypes[i].id",partTypes[i].id)
                console.log("countarray.male.attributescount[partTypes[i].id]",countarray.male.attributescount[partTypes[i].id][codeArr[i]-1])

                console.log("countarray.male.attributescount[partTypes[i].id][codeArr[i]-1]",countarray.male.attributescount[partTypes[i].id][codeArr[i]-1])
                console.log("partTypes[i].validcounts[codeArr[i]-1]",partTypes[i].validcounts[codeArr[i]-1])
                //console.log(partTypes[i].attrSex[codeArr[i]-1])
                //console.log(partTypes[i].validcounts[codeArr[i]-1])
                console.log("partTypes----------------------------------");
                if(countarray.male.attributescount[partTypes[i].id][codeArr[i]-1]>partTypes[i].validcounts[codeArr[i]-1])
                  valid = false;
                else
                  countarray.male.attributescount[partTypes[i].id][codeArr[i]-1] = countarray.male.attributescount[partTypes[i].id][codeArr[i]-1]+1;

              }
          }

            if(valid)
              countarray.male.count = countarray.male.count+1;
        }
        else{
          valid = false;
        }

      }
      if(gender == "f"){
        gender = "female";
        if(countarray.female.count<4231  && valid){

            for(var i=0;i<codeArr.length;i++){
              if(partTypes[i].id!="face" && codeArr[i]!=0){

                console.log("codeArr",codeArr);
                console.log("partTypes[i].validcounts",partTypes[i].validcounts)
                console.log("partTypes[i].id",partTypes[i].id)
                console.log("countarray.female.attributescount[partTypes[i].id]",countarray.female.attributescount[partTypes[i].id][codeArr[i]-1])

                console.log("countarray.female.attributescount[partTypes[i].id][codeArr[i]-1]",countarray.female.attributescount[partTypes[i].id][codeArr[i]-1])
                console.log("partTypes[i].validcounts[codeArr[i]-1]",partTypes[i].validcounts[codeArr[i]-1])
                //console.log(partTypes[i].attrSex[codeArr[i]-1])
                //console.log(partTypes[i].validcounts[codeArr[i]-1])
                console.log("partTypes----------------------------------");
                if(countarray.female.attributescount[partTypes[i].id][codeArr[i]-1]>partTypes[i].validcounts[codeArr[i]-1])
                  valid = false;
                else
                  countarray.female.attributescount[partTypes[i].id][codeArr[i]-1] = countarray.female.attributescount[partTypes[i].id][codeArr[i]-1]+1;

              }
            }


            if(valid)
              countarray.female.count = countarray.female.count+1;
        }
        else{
          valid = false;
        }

      }
      if(gender == "martian"){
        gender = "martian";
        if(countarray.martian.count<21 && valid){

            for(var i=0;i<codeArr.length;i++){
              if(partTypes[i].id!="face" && codeArr[i]!=0){

                console.log("codeArr",codeArr);
                console.log("partTypes[i].validcounts",partTypes[i].validcounts)
                console.log("partTypes[i].id",partTypes[i].id)
                console.log("countarray.martian.attributescount[partTypes[i].id]",countarray.martian.attributescount[partTypes[i].id][codeArr[i]-1])

                console.log("countarray.martian.attributescount[partTypes[i].id][codeArr[i]-1]",countarray.martian.attributescount[partTypes[i].id][codeArr[i]-1])
                console.log("partTypes[i].validcounts[codeArr[i]-1]",partTypes[i].validcounts[codeArr[i]-1])
                //console.log(partTypes[i].attrSex[codeArr[i]-1])
                //console.log(partTypes[i].validcounts[codeArr[i]-1])
                console.log("partTypes----------------------------------");
                if(countarray.martian.attributescount[partTypes[i].id][codeArr[i]-1]>partTypes[i].validcounts[codeArr[i]-1])
                  valid = false;
                else
                  countarray.martian.attributescount[partTypes[i].id][codeArr[i]-1] = countarray.martian.attributescount[partTypes[i].id][codeArr[i]-1]+1;

              }
            }
            if(valid)
              countarray.martian.count = countarray.martian.count+1;
        }
        else{
          valid = false;
        }

      }
      if(gender == "z"){
          gender = "zombie";
          if(countarray.zombie.count<91 && valid){
             for(var i=0;i<codeArr.length;i++){
              if(partTypes[i].id!="face" && codeArr[i]!=0){

                console.log("codeArr",codeArr);
                console.log("partTypes[i].validcounts",partTypes[i].validcounts)
                console.log("partTypes[i].id",partTypes[i].id)
                console.log("countarray.zombie.attributescount[partTypes[i].id]",countarray.zombie.attributescount[partTypes[i].id][codeArr[i]-1])

                console.log("countarray.zombie.attributescount[partTypes[i].id][codeArr[i]-1]",countarray.zombie.attributescount[partTypes[i].id][codeArr[i]-1])
                console.log("partTypes[i].validcounts[codeArr[i]-1]",partTypes[i].validcounts[codeArr[i]-1])
                //console.log(partTypes[i].attrSex[codeArr[i]-1])
                //console.log(partTypes[i].validcounts[codeArr[i]-1])
                console.log("partTypes----------------------------------");
                if(countarray.zombie.attributescount[partTypes[i].id][codeArr[i]-1]>partTypes[i].validcounts[codeArr[i]-1])
                  valid = false;
                else
                  countarray.zombie.attributescount[partTypes[i].id][codeArr[i]-1] = countarray.zombie.attributescount[partTypes[i].id][codeArr[i]-1]+1;

              }
            }
            if(valid)
              countarray.zombie.count = countarray.zombie.count+1;
          }
          else{
            valid = false;
          }
      }
      if(gender == "n"){
          gender = "neptunite";
          if(countarray.neptunite.count<61 && valid){
            for(var i=0;i<codeArr.length;i++){
              if(partTypes[i].id!="face" && codeArr[i]!=0){

                console.log("codeArr",codeArr);
                console.log("partTypes[i].validcounts",partTypes[i].validcounts)
                console.log("partTypes[i].id",partTypes[i].id)
                console.log("countarray.neptunite.attributescount[partTypes[i].id]",countarray.neptunite.attributescount[partTypes[i].id][codeArr[i]-1])

                console.log("countarray.neptunite.attributescount[partTypes[i].id][codeArr[i]-1]",countarray.neptunite.attributescount[partTypes[i].id][codeArr[i]-1])
                console.log("partTypes[i].validcounts[codeArr[i]-1]",partTypes[i].validcounts[codeArr[i]-1])
                //console.log(partTypes[i].attrSex[codeArr[i]-1])
                //console.log(partTypes[i].validcounts[codeArr[i]-1])
                console.log("partTypes----------------------------------");
                if(countarray.neptunite.attributescount[partTypes[i].id][codeArr[i]-1]>partTypes[i].validcounts[codeArr[i]-1])
                  valid = false;
                else
                  countarray.neptunite.attributescount[partTypes[i].id][codeArr[i]-1] = countarray.neptunite.attributescount[partTypes[i].id][codeArr[i]-1]+1;

              }
            }
            if(valid)
              countarray.neptunite.count = countarray.neptunite.count+1;
          }
          else{
            valid = false;
          }
      }
      // console.log("valid------------------",valid)
      //  console.log("countarray------------------",countarray)
      if(valid){

          await saveFaceByCode(codeArr, `${outputFolder}/${gender}/${gender}${imgCount}${ext}`);

          // Add character with accessories
          c = {
            id: imgCount,
            gender: gender,
            attributes: []
          };
          for (let i=0; i < partTypes.length; i++) {
            if (partTypes[i].attrNames.length != 0)
            if (codeArr[i] != 0) {
              let attrName = partTypes[i].attrNames[codeArr[i]-1];
              if (attrName.length > 0) {
                c.attributes.push(attrMap[attrName]);
                attrFreq[attrName]++;
              }
            }
          }
          characters.push(c);

          imgCount++;
      }
    } else {
      // console.log(`Skipping. r = ${r}, gender = ${gender}, codeArr=${codeArr}`);
    }

    // Increate code by 1
    let canIncrease = false;
    for (let i=0; i < partTypes.length; i++) {
      if (codeArr[i] < partTypes[i].count) {
        canIncrease = true;
        codeArr[i]++;
        for (let j=i-1; j>=0; j--) {
          if (partTypes[j].required)
            codeArr[j] = 1;
          else
            codeArr[j] = 0;
        }
        break;
      }
    }
    if (!canIncrease) exhausted = true;
    if (imgCount == desiredCount) break;
  }

  // Save characters' JSON
  fs.writeFileSync(outputCharacterJSON, JSON.stringify(characters));

  console.log("Total generated characters: ", imgCount);
  console.log("Attribute frequencies: ", attrFreq);
}

async function generateManually() {

  // Женин любимый

   code = [2,2,0,2,2];
  //code = arr;
  await saveFaceByCode(code, "test.png");

  let punks = require("./generated_faces/characters.json");
  c = {
    id: 10000,
    gender: "Male",
    attributes: [3,7,13,21,29]
  };
  punks.push(c);
  fs.writeFileSync("characters.json", JSON.stringify(punks));
}

async function main() {
  await generateFaces();
  // await generateManually();
}

main();

// function test() {
//   code = [1, 6, 2, 4, 4, 1, 8, 1];
//   console.log(detectGender(code));
// }
// test();