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
import Button from "../components/global/Button.vue";

const strategies = [
  {
    name : 'WET',
    label: 'Papuga',
    description: 'Pierwszy ruch to współpraca. Następny ruch to kopia poprzedniego ruchu przeciwnika.'
  },
  {
    name : 'IDIOT',
    label: 'Przyjaciel',
    description: 'Zawsze współpracuje'
  },
  {
    name : 'CHEAT',
    label: 'Oszust',
    description: 'Zawsze oszukuje'
  },
  {
    name : 'AVENGER',
    label: 'Mściciel',
    description: 'Cały czas współpracuje. Jeżel choć raz zostanie oszukany, cały czas oszukuje.'
  },
  {
    name : 'HOLMES',
    label: 'Sherlock Holmes',
    description: 'Zaczyna od współpracy, oszustwa, współpracy, współpracy. Jeżeli został oszukany, gra jak Papuga. W przeciwnym wypadku gra jak Oszust.'
  },
  {
    name : 'WET_FOR_TWO',
    label: 'Wet za dwa wety',
    description: 'Papuga, z tą różnicą, że zdradza tylko wtedy, kiedy przeciwnik zdradził dwa razy z rzędu. Pierwsza zdrada mogła być pomyłką!'
  },
  {
    name : 'LUG',
    label: 'Cham',
    description: 'Pierwszy ruch to współpraca. Jeżeli jego poprzedni ruch jest taki sam jak ruch przeciwnika - współpracuje. W przeciwnym wypadku oszukuje.'
  },
  {
    name : 'BRUTAL',
    label: 'Okrutnik',
    description: 'Pierwszy ruch to współpraca. Jeżeli przeciwnik kooperuje, zdradza co drugą rundę. Jeżeli przeciwnik zdradzi, oszukuje do samego końca.'
  },
  {
    name : 'TESTER',
    label: 'Tester',
    description: 'Pierwszy ruch to zdrada. Jeżeli przeciwnik również zdradził, zdradza do samego końca. Jeżeli przeciwnik kooperował, współpracuje do samego końca.'
  },
  {
    name : 'RANDOM',
    label: 'Przypadek',
    description: 'Losowo współpracuje lub oszukuje - 50/50 szans wyboru.'
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
  display: flex;
  width: 88%;
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