<template>
  <Page v-if="step === 1 ">
    <template #title>
      Cześć!
    </template>
    <div class="content">
      <p>Dziękuję, że zdecydowałeś/aś się pomóc mi w moim badaniu.</p>
      <p>Celem mojej pracy będzie zbadanie korelacji wybieranych strategii z wynikami testu Thomasa Kilmanna.</p>
      <p>Na początku jednak, chciałbym przedstawić Ci na czym polega dylemat więźnia.</p>
      <p>Następnie zapraszam Cię do wzięcia udziału w turnieju iterowanego dylematu więźnia.</p>
      <p>Po rozegraniu turnieju, czeka na Ciebie jeszcze zestaw 30 pytań, który pozwoli zdefiniować Twoją postawę w sytuacji konfliktowej.</p>
      <p><strong>Spokojnie</strong>, każde pytanie testu ma do wyboru jedną z dwóch odpowiedzi i nie potrzebuje żadnego przygotowania z Twojej strony!</p>
    </div>
    <div class="nav">
      <img class="nav__arrow" :src="ArrowRight" alt="→" @click="stepAdd">
    </div>
  </Page>
  <Page v-if="step === 2">
    <template #title>
      Dylemat więźnia
    </template>
    <div class="content">
      <p>Jest to jeden z najpopularniejszych problemów teorii gier. W oryginalnej postaci brzmi następująco: </p>
      <p class="dillema">Dwoje podejrzanych zostało zatrzymanych przez policję. Policja, nie mając wystarczających dowodów do postawienia zarzutów, rozdziela więźniów i przedstawia każdemu z nich tę samą ofertę:</p>
      <p class="dillema">Jeśli będzie zeznawać przeciwko drugiemu, a drugi będzie milczeć, to zeznający wyjdzie na wolność, a milczący dostanie dziesięcioletni wyrok.</p>
      <p class="dillema">Jeśli obaj będą milczeć, obaj odsiedzą 6 miesięcy za inne przewinienia.</p>
      <p class="dillema">Jeśli obaj będą zeznawać, obaj dostaną pięcioletnie wyroki.</p>
      <p class="dillema">Każdy z nich musi podjąć decyzję niezależnie i żaden nie dowie się, czy drugi milczy czy zeznaje, aż do momentu wydania wyroku.</p>
      <p class="dillema"><strong>Jak powinni postąpić?</strong></p>
      <p>Teoria gier zakłada, że więźniowie wolą krótszy wyrok oraz żadnemu z nich nie zależy na niskim wyroku drugiego.</p>
      <p>Zatem celem obojga jest uzyskanie jak najmniejszego wyroku.</p>
      <p>Więźniowie grają więc w grę, w której dopuszczalne strategie to: współpracuj (milcz) lub zdradzaj (zeznawaj).</p>
    </div>
    <div class="nav">
      <img class="nav__arrow" :src="ArrowLeft" alt="←" @click="stepSubstract">
      <img class="nav__arrow" :src="ArrowRight" alt="→" @click="stepAdd">
    </div>
  </Page>
  <Page v-if="step === 3">
    <template #title>
      Gra w zaufanie
    </template>
    <div class="content">
      <p>Dylemat więźnia można również zobrazować w inny sposób.</p>
      <p>Ty oraz przeciwnik stoicie przed pewnym budynkiem.</p>
      <p>Jeśli wrzucisz do niego monetę, przeciwnik otrzyma trzy monety. Taki sam efekt daje wrzucenie monety przez drugiego gracza.</p>
      <p>Oboje możecie <strong>WSPÓŁPRACOWAĆ (wrzucić monetę)</strong> lub <strong>ZDRADZAĆ (nie wrzucać monety)</strong>.</p>
      <div class="animation">
        <img class="animation__single" :src="Me" alt="left person"/>
        <img class="animation__machine" :class="[machine_animation]" :src="Building" alt="machine"/>
        <img class="animation__single" :src="Enemy" alt="right person"/>
      </div>
      <p><strong>Załóżmy, że drugi gracz postanowił nie wrzucać monety.</strong></p>
      <p>Co robisz?</p>
      <div class="choices-button">
        <Button @click="stepAdd(); setFirstChoice('cooperate')">Współpracuję</Button>
        <Button @click="stepAdd(); setFirstChoice('treat')">Oszukuję</Button>
      </div>
    </div>
    <div class="nav">
      <img class="nav__arrow" :src="ArrowLeft" alt="←" @click="stepSubstract">
    </div>
  </Page>
  <Page v-if="step === 4 && first_choice === 'cooperate'">
    <template #title>
      Gra w zaufanie
    </template>
    <div class="content">
      <p>Niestety, lepiej jest nie nadstawiać drugiego policzka!</p>
      <p>Jeżeli współpracujesz gdy przeciwnik oszukuje - przegrywasz.</p>
      <p>Ty tracisz monetę, przeciwnik zaś zyskuje trzy (wynik: -1 do +3). Jeśli jednak oboje oszukacie, nic nie zyskujecie, ale i nic nie tracicie (wynik: 0 do 0).</p>
      <p>Powinieneś więc <strong>ZDRADZAĆ</strong>.</p>
      <div class="animation">
        <img class="animation__single" :src="player_left" alt="left person"/>
        <img class="animation__machine" :class="[machine_animation]" :src="Building" alt="machine"/>
        <img class="animation__single" :src="player_right" alt="right person"/>
      </div>
      <p><strong>Załóżmy teraz, że drugi gracz postanowił jednak wrzucić monetę.</strong></p>
      <p>Co robisz?</p>
      <div class="choices-button">
        <Button @click="stepAdd(); setSecondChoice('cooperate')">Współpracuję</Button>
        <Button @click="stepAdd(); setSecondChoice('treat')">Oszukuję</Button>
      </div>
    </div>
    <div class="nav">
      <img class="nav__arrow" :src="ArrowLeft" alt="←" @click="stepSubstract(); setFirstChoice(null)">
    </div>
  </Page>
  <Page v-if="step === 4 && first_choice === 'treat'">
    <template #title>
      Gra w zaufanie
    </template>
    <div class="content">
      <p>Dokładnie tak! Po co dawać oszustowi szansę, żeby Cię wykorzystał?</p>
      <p>Jeżeli współpracujesz gdy przeciwnik oszukuje - przegrywasz.</p>
      <p>Ty tracisz monetę, przeciwnik zaś zyskuje trzy (wynik: -1 do +3). Jeśli jednak oboje oszukacie, nic nie zyskujecie, ale i nic nie tracicie (wynik: 0 do 0).</p>
      <p>Powinieneś więc <strong>ZDRADZAĆ</strong>.</p>
      <div class="animation">
        <img class="animation__single" :src="player_left" alt="left person"/>
        <img class="animation__machine" :class="[machine_animation]" :src="Building" alt="machine"/>
        <img class="animation__single" :src="player_right" alt="right person"/>
      </div>
      <p><strong>Załóżmy teraz, że drugi gracz postanowił jednak wrzucić monetę.</strong></p>
      <p>Co robisz?</p>
      <div class="choices-button">
        <Button @click="stepAdd(); setSecondChoice('cooperate')">Współpracuję</Button>
        <Button @click="stepAdd(); setSecondChoice('treat')">Oszukuję</Button>
      </div>
    </div>
    <div class="nav">
      <img class="nav__arrow" :src="ArrowLeft" alt="←" @click="stepSubstract(); setFirstChoice(null)">
    </div>
  </Page>
  <Page v-if="step === 5 && second_choice === 'cooperate'">
    <template #title>
      Gra w zaufanie
    </template>
    <div class="content">
      <p>Jesteś super człowiekiem!.. Jednakże czy Twój wybór był słuszny?</p>
      <p>Jeżeli oboje współpracujecie to oboje musicie poświęcić monetę, żeby zdobyć trzy (wynik: +2 do +2).</p>
      <p>Ale jeśli oszukujesz, a przeciwnik współpracuje, to Ty zyskasz trzy monety, podczas gdy drugi gracz jedną straci (wynik: +3 do -1).</p>
      <p>W dalszym ciągu powinieneś więc <strong>ZDRADZAĆ</strong>.</p>
      <div class="animation">
        <img class="animation__single" :src="player_left" alt="left person"/>
        <img class="animation__machine" :class="[machine_animation]" :src="Building" alt="machine"/>
        <img class="animation__single" :src="player_right" alt="right person"/>
      </div>
      <p>Na tym właśnie polega dylemat więźnia. Zaufanie do innych jest ok, jednakże często pozwala innym Cię wykorzystywać.</p>
      <p>Ale co jeśli zagramy w taką grę ...</p>
      <div class="choices-button">
        <Button @click="() => { stage += 1 }">...więcej niż tylko jeden raz?</Button>
      </div>
    </div>
    <div class="nav">
      <img class="nav__arrow" :src="ArrowLeft" alt="←" @click="stepSubstract(); setSecondChoice(null)">
    </div>
  </Page>
  <Page v-if="step === 5 && second_choice === 'treat'">
    <template #title>
      Gra w zaufanie
    </template>
    <div class="content">
      <p>Cóż za podłość! Niestety, jest to słuszna decyzja...</p>
      <p>Jeżeli oboje współpracujecie to oboje musicie poświęcić monetę, żeby zdobyć trzy (wynik: +2 do +2).</p>
      <p>Ale jeśli oszukujesz, a przeciwnik współpracuje, to Ty zyskasz trzy monety, podczas gdy drugi gracz jedną straci (wynik: +3 do -1).</p>
      <p>W dalszym ciągu powinieneś więc <strong>ZDRADZAĆ</strong>.</p>
      <div class="animation">
        <img class="animation__single" :src="player_left" alt="left person"/>
        <img class="animation__machine" :class="[machine_animation]" :src="Building" alt="machine"/>
        <img class="animation__single" :src="player_right" alt="right person"/>
      </div>
      <p>Na tym właśnie polega dylemat więźnia. Zaufanie do innych jest ok, jednakże często pozwala innym Cię wykorzystywać.</p>
      <p>Ale co jeśli zagramy w taką grę ...</p>
      <div class="choices-button">
        <Button @click="() => { stage += 1 }">...więcej niż tylko jeden raz?</Button>
      </div>
    </div>
    <div class="nav">
      <img class="nav__arrow" :src="ArrowLeft" alt="←" @click="stepSubstract(); setSecondChoice(null)">
    </div>
  </Page>
</template>

<script setup>
import {onUnmounted, ref, watch} from 'vue';
import Page from "./Page.vue";
import Button from "../components/Button.vue";
import { stage } from "../../composition-api/app";
import ArrowLeft from "../static/ArrowLeft.svg";
import ArrowRight from "../static/ArrowRight.svg";
import Me from "../static/Me.png";
import Enemy from "../static/Enemy.png";
import MeCC from "../static/animations/MeCC.gif";
import MeCT from "../static/animations/MeCT.gif";
import MeTC from "../static/animations/MeTC.gif";
import MeTT from "../static/animations/MeTT.gif";
import EnemyCC from "../static/animations/EnemyCC.gif";
import EnemyCT from "../static/animations/EnemyCT.gif";
import EnemyTC from "../static/animations/EnemyTC.gif";
import EnemyTT from "../static/animations/EnemyTT.gif";
import Building from "../static/Building.png";

const step = ref(1);

const player_left = ref(Me);
const player_right = ref(Enemy);
const animation_timeout = ref(null);

const first_choice = ref(null);
const second_choice = ref(null);

const machine_animation = ref(null);
const machine_animation_timeout = ref(null)

const changeSrc = (src_left, src_right) => {
  player_left.value = src_left;
  player_right.value = src_right;
  machine_animation_timeout.value = setTimeout(() => {
    if (src_left === MeCC && src_right === EnemyCC) {
      machine_animation.value = 'win';
    } else if ((src_left === MeCT && src_right === EnemyCT) || (src_left === MeTC && src_right === EnemyTC)) {
      machine_animation.value = 'one-win';
    }
    else {
      machine_animation.value = 'lose';
    }
    resetMachineAnimation();
  }, 100)
  animation_timeout.value = setTimeout(defaultSrc, 2000);
}

const defaultSrc = () => {
  player_left.value = Me;
  player_right.value = Enemy;
  clearTimeout(animation_timeout.value);
}

const resetMachineAnimation = () => {
  machine_animation_timeout.value = setTimeout(() => {
    machine_animation.value = null;
    clearTimeout(machine_animation_timeout.value);
  }, 1500)
}

const setFirstChoice = (choice) => {
  first_choice.value = choice;
}

const setSecondChoice = (choice) => {
  second_choice.value = choice;
}

const stepAdd = () => {
  step.value += 1;
}

const stepSubstract = () => {
  step.value -= 1;
}

watch(first_choice, () => {
  if (first_choice.value === 'cooperate') {
    changeSrc(MeCT, EnemyCT);
  }
  if (first_choice.value === 'treat') {
    changeSrc(MeTT, EnemyTT);
  }
})

watch(second_choice, () => {
  if (second_choice.value === 'cooperate') {
    changeSrc(MeCC, EnemyCC);
  }
  if (second_choice.value === 'treat') {
    changeSrc(MeTC, EnemyTC);
  }
  if (second_choice.value === null) {
    if (first_choice.value === 'cooperate') {
      changeSrc(MeCT, EnemyCT);
    }
    if (first_choice.value === 'treat') {
      changeSrc(MeTT, EnemyTT);
    }
  }
})

onUnmounted(() => {
  clearInterval(animation_timeout.value);
  clearTimeout(machine_animation_timeout.value);
})
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  user-select: none;

  p {
    text-align: center;
  }

  strong {
    font-weight: bold;
  }
}

.nav {
  position: absolute;
  bottom: -10%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 40px;

  &__arrow {
    width: 72px;
    height: 72px;
    cursor: pointer;
  }
}

.dillema {
  padding: 0 40px;
  font-style: italic;
}

.animation {
  display: flex;
  justify-content: center;
  align-items: end;

  &__single {
    width: 200px;
    margin: 0 -72px;
    position: relative;
    z-index: 1;
  }

  &__machine {
    height: 240px;
    position: relative;
    z-index: 2;
    filter: grayscale(1) hue-rotate(0deg);
    transition: 0.4s;
    transition-delay: 1s;

    &.win {
      filter: grayscale(0) hue-rotate(0deg);
    }

    &.one-win {
      filter: grayscale(0) hue-rotate(320deg);
    }

    &.lose {
      filter: grayscale(0) hue-rotate(250deg);
    }
  }
}

.choices-button {
  display: flex;
  gap: 40px;
}
</style>
