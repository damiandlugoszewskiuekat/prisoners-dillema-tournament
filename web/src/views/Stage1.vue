<template>
  <Page v-if="step === 0">
    <template #title>
      Na początku podaj swoje imię i nazwisko!
    </template>
    <div class="content">
      <Input v-model="nick" placeholder="Imię i nazwisko*"/>
      <Button :disabled="!nick.length" @click="addStep">Dołącz</Button>
    </div>
  </Page>
  <Page v-if="step === 1">
    <template #title>
      Poznaj dostępne strategie w turnieju!
    </template>
    <div class="content">
      <div class="strategies">
        <div
            class="strategies__strategy"
            v-for="(strategy, index) in strategies"
            :key="index"
        >
          <p class="strategies__label"><strong>{{ strategy.label }}</strong></p>
          <p class="strategies__description">{{ strategy.description }}</p>
          <Button @click="handleModal(true, strategy)">
            Sprawdź!
          </Button>
        </div>
      </div>
      <Button @click="handleClick">Zrozumiano!</Button>
    </div>
  </Page>
  <StrategyModal
      v-if="is_open"
      :is_open="is_open"
      @close="handleModal(false, {})"
      :strategy="strategy_data"
  />
</template>

<script setup>
import { ref } from 'vue';
import {metadata, setNick} from "../../composition-api/app";
import Page from "./Page.vue";
import Button from "../components/Button.vue";
import Input from "../components/Input.vue";
import StrategyModal from "../components/StrategyModal.vue";

const nick = ref(metadata.value?.nick || '')
const step = ref(0);
const is_open = ref(false);
const strategy_data = ref({});

const handleClick = () => {
  setNick(nick.value)
}

const addStep = () => {
  step.value += 1;
}

const handleModal = (bool, strategy) => {
  is_open.value = bool;
  strategy_data.value = strategy;
}

const strategies = [
  {
    name : 'WET',
    label: 'Papuga',
    description: 'W pierwszym ruchu współpracuję. Mój następny ruch to kopia poprzedniego ruchu przeciwnika.'
  },
  {
    name : 'IDIOT',
    label: 'Przyjaciel',
    description: 'Zawsze współpracuję'
  },
  {
    name : 'CHEAT',
    label: 'Oszust',
    description: 'Zawsze oszukuję'
  },
  {
    name : 'AVENGER',
    label: 'Mściciel',
    description: 'Cały czas współpracuję. Jeżeli choć raz zostanę zdradzony, oszukuję do końca gry.'
  },
  {
    name : 'HOLMES',
    label: 'Sherlock Holmes',
    description: 'Zaczynam od współpracy, oszustwa, współpracy, współpracy. Jeżeli dotychczas zostałem oszukany, gram jak Papuga. W przeciwnym wypadku gram jak Oszust.'
  },
  {
    name : 'WET_FOR_TWO',
    label: 'Wet za dwa wety',
    description: 'Papuga, z tą różnicą, że zdradzam tylko wtedy, kiedy przeciwnik zdradził dwa razy z rzędu. Pierwsza zdrada mogła być pomyłką!'
  },
  {
    name : 'LUG',
    label: 'Cham',
    description: 'W pierwszym ruchu współpracuję. Jeżeli mój poprzedni ruch jest taki sam jak ruch przeciwnika - współpracuję. Jeśli się różnią - oszukuję.'
  },
  {
    name : 'BRUTAL',
    label: 'Okrutnik',
    description: 'W pierwszym ruchu współpracuję. Jeżeli przeciwnik kooperuje, zdradzam co drugą rundę. Jeżeli przeciwnik zdradzi, oszukuję do samego końca.'
  },
  {
    name : 'TESTER',
    label: 'Tester',
    description: 'W pierwszym ruchu zdradzam. Jeżeli przeciwnik również zdradził, zdradzam do samego końca. Jeżeli przeciwnik kooperował, współpracuję z nim do samego końca.'
  },
  {
    name : 'RANDOM',
    label: 'Przypadek',
    description: 'Losowo współpracuję lub oszukuję - 50/50 szans wyboru.'
  },
]
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

  strong {
    font-weight: bold;
  }
}

.strategies {
  margin: 16px 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-content: center;
  align-items: center;
  gap: 20px 10px;
  flex-wrap: wrap;

  &__strategy {
    width: 210px;
    height: 220px ;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    row-gap: 16px;
    text-align: center;
  }
}
</style>
