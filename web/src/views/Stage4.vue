<template>
  <Page>
    <template #title>
      Wybierz strategię do gry z przeciwnikiem!
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
          <Button
              :disabled="selected_strategy && selected_strategy !== strategy.name"
              @click="setStrategy(strategy.name)"
          >
            {{strategy.label}}
          </Button>
        </div>
      </div>
      <p>Jeżeli nie wybierzesz strategii, automatycznie zostanie ona wybrana losowo.</p>
      <div class="progress-bar" v-if="strategy_timer">
        <div class="progress-bar__left" :style="`width: calc(${strategy_timer} * 1.67%)`"/>
        <div class="progress-bar__text">{{strategy_timer}}</div>
      </div>
    </div>
  </Page>
</template>

<script setup>
import Page from "./Page.vue";
import {onMounted, ref} from 'vue'
import {setStrategy, strategy_timer, selected_strategy} from "../../composition-api/app";
import Button from "../components/Button.vue";

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

const room = ref('')

onMounted(() => {
  selected_strategy.value = null;
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

.strategies {
  margin: 16px 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;

  &__strategy {
    width: 140px;
    height: 256px ;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    text-align: center;
  }
}

.progress-bar {
  background: whitesmoke;
  width: 100%;
  height: 16px;
  border-radius: 8px;
  position: relative;

  &__left {
    background: orangered;
    border-radius: 8px;
    height: 100%;
  }

  &__text {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
