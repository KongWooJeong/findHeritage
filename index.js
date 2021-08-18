const $gameStartButton = document.querySelector('.game-start-button');
const $wrapMainImage = document.querySelector('.wrap-main-image');

const $gameIntroContainer = document.querySelector('.game-intro');

const $gameSubContent = document.querySelector('.game-sub-content');
const $gameTimeoutCount = document.querySelector('.game-timeout-count');
const $gameRemainCorrectCount = document.querySelector('.game-remain-correct-count');
const $gameRmainHintCount = document.querySelector('.game-remain-hint-count');
const $gameHintButton = document.querySelector('.game-hint-button');

const $gameLevelChoices = document.querySelector('.game-level-choices');
const $gameCardsContatiner = document.querySelector('.game-cards-container');

const $gameResultContainer = document.querySelector('.game-result-container');
const $gameResultMessage = document.querySelector('.game-result-message');
const $gameResultImage = document.querySelector('.game-result-image');

const NONE_DISPLAY = 'none-display';
const LELVEL_CHOICE = 'level-choice';
const WRAP_CARDS = 'wrap-cards';
const BACK_CARD = 'back-card';
const FRONT_CARD = 'front-card';
const SELECTED = 'selected';
const CLICK_DISABLE = 'click-disable';
const SUCCESS = 'success';
const FAIL = 'fail';
const SHOW_HINT = 'show-hint';

const RESATRT = '재시작';
const LEVEL_CARD_QUANTITY = {
	beginner: 10,
	intermediate: 20,
	advanced: 30,
};
const GAME_RESULT_DATA = {
	success: {
		message: "문화재를 전부 찾으셨네요. 축하드립니다.",
		url: "./images/gameSuccessImage.png",
	},
	fail: {
		message: "문화재를 찾지 못하셨네요. 실망입니다.",
		url: "./images/gameFailImage.jpeg",
	},
};
const CARD_IMAGES = [
	"./images/heritage01.jpeg",
	"./images/heritage02.jpeg",
	"./images/heritage03.jpeg",
	"./images/heritage04.jpeg",
	"./images/heritage05.jpeg",
	"./images/heritage06.jpeg",
	"./images/heritage07.jpeg",
	"./images/heritage08.jpeg",
	"./images/heritage09.jpeg",
	"./images/heritage10.jpeg",
	"./images/heritage11.jpeg",
	"./images/heritage12.jpeg",
	"./images/heritage13.jpeg",
	"./images/heritage14.jpeg",
	"./images/heritage15.jpeg",
];
const GAME_AUDIO_DATA = {
	startGame: new Audio('./music/gameStart.mp3'),
	successGame: new Audio('./music/gameSuccess.mp3'),
	failGame: new Audio('./music/gameFail.mp3'),
	correctCard: new Audio('./music/correct.wav'),
	uncorrenctCard: new Audio('./music/uncorrect.mp3'),
	buttonClick: new Audio('./music/buttonClick.wav'),
};

const currentAudio = {
	play: function (audioObject) {
		audioObject.play();
	},
	initialize: function (...audioObjects) {
		audioObjects.forEach( (audio) => {
			audio.pause();
			audio.currentTime = 0;
		});
	},
	controlVolume: function () {
		GAME_AUDIO_DATA.startGame.volume = 0.3;
	}
};
const currentGameData = {
	initialize: function () {
		this.level = null;
		this.cardImages = [];
		this.previousSelectedCard = null;
		this.totalCurrectCount = 0;
		this.timeoutCount = 70;
		this.timeoutID = null;
		this.hintCount = 3;
	},
};

initialize();

function resetDisplayGameInformation() {
	while ($gameCardsContatiner.hasChildNodes()) {
		$gameCardsContatiner.firstChild.remove();
	}

	$gameCardsContatiner.classList.add(NONE_DISPLAY);
	$gameSubContent.classList.add(NONE_DISPLAY);
	$gameResultContainer.classList.add(NONE_DISPLAY);
	$gameIntroContainer.classList.remove(NONE_DISPLAY);
}

function gameOver(gameResult = null) {
	const result = gameResult ? SUCCESS : FAIL;

	currentAudio.initialize(GAME_AUDIO_DATA.startGame);
	currentAudio.play(gameResult ? GAME_AUDIO_DATA.successGame : GAME_AUDIO_DATA.failGame);
	clearInterval(currentGameData.timeoutID);

	$gameCardsContatiner.classList.add(NONE_DISPLAY);
	$gameResultContainer.classList.remove(NONE_DISPLAY);
	$gameSubContent.classList.add(NONE_DISPLAY);

	$gameResultImage.src = GAME_RESULT_DATA[result].url;
	$gameResultMessage.textContent = GAME_RESULT_DATA[result].message;
}

function checkCorrectSelectedCard(currentWrapCard) {
	const previousWrapCard = currentGameData.previousSelectedCard;

	const currentCardIndex = currentWrapCard.dataset.value;
	const previousCardIndex = previousWrapCard.dataset.value;
	const isCorrectCard = currentCardIndex === previousCardIndex;

	currentGameData.previousSelectedCard = null;

	currentAudio.initialize(GAME_AUDIO_DATA.correctCard, GAME_AUDIO_DATA.uncorrenctCard);

	if(!isCorrectCard) {
		currentAudio.play(GAME_AUDIO_DATA.uncorrenctCard);

		$gameCardsContatiner.classList.add(CLICK_DISABLE);

		setTimeout(() => {
			previousWrapCard.classList.remove(SELECTED);
			currentWrapCard.classList.remove(SELECTED);
			$gameCardsContatiner.classList.remove(CLICK_DISABLE);
		}, 500);
		return
	}

	currentGameData.totalCurrectCount--;

	$gameRemainCorrectCount.textContent = currentGameData.totalCurrectCount;

	currentAudio.play(GAME_AUDIO_DATA.correctCard);

	if (!currentGameData.totalCurrectCount) {
		gameOver(true);
	}
}

function handleBackCardClick({ target }) {
	const selectedCard = target;
	const isBackCard = selectedCard.classList.contains(BACK_CARD);

	if (!isBackCard) {
		return;
	}

	currentAudio.play(GAME_AUDIO_DATA.buttonClick);

	const selectedWrapCard = selectedCard.parentElement;
	const previousSelectedCard = currentGameData.previousSelectedCard;

	selectedCard.parentElement.classList.add(SELECTED);

	if (!previousSelectedCard) {
		currentGameData.previousSelectedCard = selectedWrapCard;
		return;
	}

	checkCorrectSelectedCard(selectedWrapCard);
}

function checkHintCount() {
	currentGameData.hintCount--;

	$gameRmainHintCount.textContent = currentGameData.hintCount;

	if (!currentGameData.hintCount) {
		$gameHintButton.removeEventListener('click', handleHintButtonClick);
	}
}

function handleHintButtonClick({ target }) {
	const $wrapCards = document.querySelectorAll(`.${WRAP_CARDS}`);

	currentAudio.play(GAME_AUDIO_DATA.buttonClick);

	$wrapCards.forEach((value) => {
		value.classList.add(SHOW_HINT);
	});

	target.classList.add(CLICK_DISABLE);

	setTimeout(() => {
		$wrapCards.forEach((value) => {
			value.classList.remove(SHOW_HINT);
			target.classList.remove(CLICK_DISABLE);
		});
	}, 2000);

	checkHintCount();
}

function startTimeoutCount() {
	currentGameData.timeoutID = setInterval(() => {
		currentGameData.timeoutCount--;

		$gameTimeoutCount.textContent = currentGameData.timeoutCount;

		if (!currentGameData.timeoutCount) {
			gameOver();
		}
	}, 1000);
}

function startGame() {
	currentAudio.play(GAME_AUDIO_DATA.startGame);
	startTimeoutCount();

	$gameCardsContatiner.addEventListener('click', handleBackCardClick);
	$gameHintButton.addEventListener('click', handleHintButtonClick);
}

function createCurrentLevelCards() {
	currentGameData.cardImages.forEach( (imageValue) => {
		const $wrapCards = document.createElement('div');
		const $backCard = document.createElement('div');
		const $frontCard = document.createElement('div');

		$wrapCards.classList.add(WRAP_CARDS);
		$backCard.classList.add(BACK_CARD);
		$frontCard.classList.add(FRONT_CARD);

		$wrapCards.dataset.value = imageValue;
		$frontCard.style.backgroundImage = `url(${CARD_IMAGES[imageValue]})`;

		$wrapCards.appendChild($backCard);
		$wrapCards.appendChild($frontCard);

		$gameCardsContatiner.appendChild($wrapCards);
	});
}

function setDisplayGameInformation() {
	$gameIntroContainer.classList.add(NONE_DISPLAY);
	$gameSubContent.classList.remove(NONE_DISPLAY);
	$gameCardsContatiner.classList.remove(NONE_DISPLAY);
	$gameSubContent.classList.remove(NONE_DISPLAY);

	$gameTimeoutCount.textContent = currentGameData.timeoutCount;
	$gameRemainCorrectCount.textContent = currentGameData.totalCurrectCount;
	$gameRmainHintCount.textContent = currentGameData.hintCount;

	createCurrentLevelCards();
}

function setRandomCardImage() {
	const originalImages = [];
	const cardImagesQuantity = LEVEL_CARD_QUANTITY[currentGameData.level];

	let duplicateImages = new Array(cardImagesQuantity).fill(null);
	let originalImagesCount = cardImagesQuantity / 2;

	currentGameData.totalCurrectCount = originalImagesCount;

	while (originalImagesCount) {
		const originalImageIndex = Math.floor(Math.random() * 15);

		if (originalImages.includes(originalImageIndex)) {
			continue;
		}

		originalImages.push(originalImageIndex);

		originalImagesCount--;
	}

	for (let i = 0; i < originalImages.length; i++) {
		let checkDuplicatecount = 2;

		while (checkDuplicatecount) {
			const duplicateImagesIndex = Math.floor(Math.random() * (cardImagesQuantity));

			if (duplicateImages[duplicateImagesIndex] !== null) {
				continue;
			}

			duplicateImages[duplicateImagesIndex] = originalImages[i];

			checkDuplicatecount--;
		}
	}

	currentGameData.cardImages = duplicateImages;
}

function handleLevelChoiceClick(selectedLevelChoice) {
	const selectedLevel = selectedLevelChoice.id;

	currentGameData.level = selectedLevel;

	currentAudio.play(GAME_AUDIO_DATA.buttonClick);
	setRandomCardImage();
	setDisplayGameInformation();
	startGame();
}

function handleGameStartButtonClick() {
	$wrapMainImage.classList.add(NONE_DISPLAY);
	$gameIntroContainer.classList.remove(NONE_DISPLAY);

	$gameLevelChoices.addEventListener('click', ({ target }) => {
		const isLevelChoice = target.classList.contains(LELVEL_CHOICE);

		if (!isLevelChoice) {
			return;
		}

		handleLevelChoiceClick(target);
	});
}

function handelGameRestartButtonClick() {
	currentAudio.initialize(GAME_AUDIO_DATA.successGame, GAME_AUDIO_DATA.failGame, GAME_AUDIO_DATA.startGame);
	clearInterval(currentGameData.timeoutID);
	resetDisplayGameInformation();
	currentGameData.initialize();
}

function initialize() {
	currentGameData.initialize();
	currentAudio.controlVolume();

	$gameStartButton.addEventListener('click', ({ target }) => {
		currentAudio.play(GAME_AUDIO_DATA.buttonClick);

		if (target.textContent === RESATRT) {
			handelGameRestartButtonClick();
			return;
		}

		target.textContent = RESATRT;

		handleGameStartButtonClick();
	});
}
