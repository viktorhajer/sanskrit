const input = document.getElementById('input-field');
const inputOrigi = document.getElementById('input-field-origi');
const inputHun = document.getElementById('input-field-hun');
const CHARACTER_TIMEOUT = 1000;

const CHARS = {
  a: ['a', 'ā'],
  d: ['d', 'ḍ'],
  h: ['h', 'ḥ'],
  i: ['i', 'ī'],
  m: ['m', 'ṁ'],
  n: ['n', 'ṇ', 'ṅ', 'ñ'],
  r: ['r', 'ṛ'],
  s: ['s', 'ṣ', 'ś'],
  t: ['t', 'ṭ'],
  u: ['u', 'ū']
};

const HUN_CHARS = {
  a: 'a',
  ā: 'á',
  i: 'i',
  ī: 'í',
  u: 'u',
  ū: 'ú',
  ṛ: 'ri',
  ṝ: 'rí',
  ḷ: 'li',
  e: 'é',
  ai: 'ij',
  o: 'ó',
  ṃ: 'm',
  ṁ: 'n',  // szóvégén m vagy ng
  ḥ: 'h',
  ṅ: 'ng',
  ñ: 'ny',
  c: 'cs',
  j: 'dzs',
  jñ: 'gy',
  ṭ: 't',
  ḍ: 'd',
  ṇ: 'n',
  y: 'j',
  ś: 's',
  ṣ: 's',
  s: 'sz',
  h: 'h',
  ḥ: 'h',
  ĩ: 'ín',
  ẽ: 'én',
  ã: 'án'
};

var TimeBox = false;
var Timeout = null;

input.addEventListener('input', event => {
  clearTimeout(Timeout);
  Timeout = setTimeout(() => {TimeBox = false;}, CHARACTER_TIMEOUT);
  if (event.data && input.value.length > 1) {
   let fullValue = input.value;
   let lastChar = fullValue[fullValue.length - 2];
   const isUpperCase = lastChar === lastChar.toUpperCase();
   lastChar = lastChar.toLowerCase();
   const lastSimpleChar = getSimpleChar(lastChar);
   const newSimpleChar = event.data.toLowerCase();
   if (TimeBox && newSimpleChar === lastSimpleChar && !!CHARS[newSimpleChar]) {
	 fullValue = fullValue.substring(0, fullValue.length - 2) + getChar(newSimpleChar, lastChar, isUpperCase);
     input.value = fullValue;	  
   }
  }
  TimeBox = true;
  updateOrigi();
  updateHun();
});

inputOrigi.addEventListener('input', event => {
  updateNew();
  updateHun();
});

function getSimpleChar(currentChar) {
  for (var key in CHARS) {
    if(CHARS[key].some(v => v === currentChar)) {
	  return key;
	}
  }
  return currentChar;
}

function getChar(newSimpleChar, currentChar, isUpperCase) {
  const index = (CHARS[newSimpleChar].indexOf(currentChar) + 1) % CHARS[newSimpleChar].length;
  const nextChar = CHARS[newSimpleChar][index];
  return isUpperCase ? nextChar.toUpperCase() : nextChar;
}

function updateOrigi() {
  let content = '';
  for(let i = 0; i < input.value.length; i++) {
	const simpleChar = getSimpleChar(input.value[i].toLowerCase());
	if(!!CHARS[simpleChar]) {
	  if (i > 0 && simpleChar === getSimpleChar(input.value[i-1].toLowerCase())) {
	    content += '*';
	  }
	  isUpperCase = input.value[i] === input.value[i].toUpperCase();
	  const num = CHARS[simpleChar].indexOf(input.value[i].toLowerCase()) + 1;
	  content += isUpperCase ? simpleChar.repeat(num).toUpperCase() : simpleChar.repeat(num);
	} else {
	  content += input.value[i];
	}
  }
  inputOrigi.value = content;
}

function updateNew() {
  let content = '';
  for(let i = 0; i < inputOrigi.value.length; i++) {
	const simpleChar = inputOrigi.value[i].toLowerCase();
	if(!!CHARS[simpleChar]) {
	  isUpperCase = inputOrigi.value[i] === inputOrigi.value[i].toUpperCase();
	  let count = 0;
	  while (i < inputOrigi.value.length-1) {
		if (inputOrigi.value[i].toLowerCase() === inputOrigi.value[i+1].toLowerCase()) {
		  count++;
		  i++;
		} else {
		  break;
		}
	  }
	  count = count % CHARS[simpleChar].length;
	  content += isUpperCase ? CHARS[simpleChar][count].toUpperCase() : CHARS[simpleChar][count];
	} else if (simpleChar !== '*'){
		console.log(simpleChar);
	  content += inputOrigi.value[i];
	}
  }
  input.value = content;
}

function updateHun() {
  let content = '';
  for(let i = 0; i < input.value.length; i++) {
	isUpperCase = input.value[i] === input.value[i].toUpperCase();
    const currentChar = input.value[i].toLowerCase();
	let secondChar = '';
	if (i + 1 < input.value.length) {
	  secondChar = input.value[i+1].toLowerCase();
	}
	let hunChar = HUN_CHARS[currentChar + secondChar];
	if (!hunChar) {
	  hunChar = HUN_CHARS[currentChar];
	} else {
	  i++;
	}
	if(!!hunChar) {
	  content += isUpperCase ? hunChar.capitalize() : hunChar;
	} else {
	  content += input.value[i];
	}
  }
  inputHun.value = content;
}

Object.defineProperty(String.prototype, 'capitalize', {
  value: function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false
});
