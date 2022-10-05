<template>
  <Loader class="content" v-if="test === null"/>
  <Page v-else-if="test && step <= 7">
    <template #title>
      {{i < 30 ? `Test Thomasa-Kilmanna - pytanie ${i + 1} z ${test.length}` : 'Wyniki testu'}}
    </template>
    <div class="content" v-if="i < 30">
      <p>Rozważ sytuacje, które mogą pojawić się w Twoim środowisku.</p>
      <p>Sytuacje, w których twoje oczekiwania różnią się od życzeń innych osób.</p>
      <p><strong>Jak zwykle wtedy reagujesz?</strong></p>
      <p>Dla każdej pary przycisków wybierz ten, którego opis jest najbardziej charakterystyczny dla Twojego zachowania.</p>
      <p>W wielu przypadkach, ani jeden opis ani drugi może nie być typowy dla Twojego zachowania, ale proszę wybrać ten, którego użycie przez Ciebie byłoby bardziej prawdopodobne.</p>
      <Button @click="pushToBody('A')">{{ test[i].a }}</Button>
      <Button @click="pushToBody('B')">{{ test[i].b }}</Button>
    </div>
    <div class="content" v-else>
      <table class="table">
        <thead>
        <tr>
          <th class="table__mode">Cecha</th>
          <th class="table__score">Punkty</th>
          <th class="table__percentiles" colspan="4">Wynik percentylowy</th>
        </tr>
        </thead>
        <tbody>
        <tr class="table__percentiles-row">
          <td></td>
          <td><div>0%</div></td>
          <td>Dolny<div>25%</div></td>
          <td colspan="2">Środkowy<div>75%</div></td>
          <td>Górny<div>100%</div></td>
        </tr>
        <tr
            class="table__quality"
            v-for="([key, val], index) in Object.entries(qualities)"
            :key="index"
        >
          <td>{{key}}</td>
          <td class="table__quality__score">{{val}}</td>
          <td colspan="4" class="table__quality__percentile">
            <div class="table__quality__bar" :style="`width: ${qualities_percentile[key]}%; background: ${getColor(index)}`"/>
            <div class="table__quality__label">{{`${qualities_percentile[key]}%`}}</div>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="content content__results" v-if="step === 1">
        <p>Powyższe skalowanie wyniku (górne 25%, środkowe 50%, dolne 25%) odnosi się do badań grupy <strong>336</strong> amerykańskich menedżerów.</p>
        <p v-for="[key,val] in Object.entries(qualities_percentile)">
          <strong>{{qualities[key]}}</strong> {{ getPoints(val) }} dla cechy <strong>{{key}}</strong> oznacza, że poniżej {{val}}%
          respondentów uzyskało ten wynik lub niższy, natomiast pozostali czyli
          {{ 100 - val }}% uzyskało taki sam wynik lub wyższy.
        </p>
      </div>
      <div class="content content__results content__intensities" v-if="step === 2">
        <p>Powyższe skalowanie wyniku (górne 25%, środkowe 50%, dolne 25%) odnosi się do badań grupy <strong>336</strong> amerykańskich menedżerów.</p>
        <p>Jeżeli cecha znajduje się w <strong>górnych 25%</strong>, jest ona <strong>silnie</strong> nasiloną cechą.</p>
        <p>Jeżeli cecha znajduje się w <strong>środkowych 50%</strong>, nasilenie tej cechy jest <strong>umiarkowane</strong>.</p>
        <p>Jeżeli cecha znajduje się w <strong>dolnych 25%</strong>, jest ona <strong>słabo</strong> nasiloną cechą.</p>
      </div>
      <div class="content content__intensities" v-if="step === 3">
        <p><strong>Cecha: Rywalizacja</strong></p>
        <p>Cechuje osoby, które poszukują konfrontacji, wykazują wojowniczy charakter, konfliktowi towarzyszy rywalizacja, która niekoniecznie musi odbywać się na zasadach fair play, a także potrzeba dominacji za wszelką cenę.</p>
      </div>
      <div class="content content__intensities" v-if="step === 4">
        <p><strong>Cecha: Współpraca</strong></p>
        <p>Najbardziej optymalny styl, oparty na akceptacji pragnień oraz celów drugiej osoby przy jednoczesnym braku przymusu rezygnacji z własnych aspiracji i dążeń.</p>
        <p>Często ten typ działania wynika ze zmęczenia działaniami rywalizacyjnymi bądź kompromisowymi, które nie przyniosły skutków lub w wyniku ingerencji "trzeciej siły”, czyli przykładowo osoby z zewnątrz.</p>
      </div>
      <div class="content content__intensities" v-if="step === 5">
        <p><strong>Cecha: Kompromis</strong></p>
        <p>Prowadzi do odczucia niepełnej satysfakcji, ponieważ wymusza rezygnację z części swoich żądań oraz skłonność do ustępstw.</p>
        <p>Osoby skłonne do kompromisów poszukują różnych możliwości wyjścia z konfliktu.</p>
      </div>
      <div class="content content__intensities" v-if="step === 6">
        <p><strong>Cecha: Unikanie</strong></p>
        <p>Cechuje jednostki słabsze w ujęciu asertywności, które np. w wyniku negatywnych doświadczeń każdy konflikt traktują jako zagrożenie dla ich funkcjonowania.</p>
        <p>Uważają, że podczas konfliktów ponoszą ogromne koszty, a więc unikają nawet najmniejszych okazji do konfrontacji.</p>
        <p>Ich celem nadrzędnym jest pozorne niedostrzeganie (czyli udawanie, że konfliktu nie ma i współpracowanie, mamy wtedy do czynienia z tzw. pokojowym współistnieniem), odwlekanie bądź ignorowanie konfliktu.</p>
      </div>
      <div class="content content__intensities" v-if="step === 7">
        <p><strong>Cecha: Dostosowanie się</strong></p>
        <p>Opiera się na chęci utrzymania odpowiednich relacji społecznych oraz harmonizowania, równoważenia stosunków z innymi ludźmi.</p>
        <p>Dominuje tu silna potrzeba przynależności, która wpływa znacząco na brak konfliktogenności, a nawet skłonność do rezygnacji z zaspokajania własnych potrzeb i realizacji własnych celów.</p>
        <p>Osoby o takim usposobieniu chętnie służą innym pomocą, co może prowadzić do sytuacji w której są wykorzystywani.</p>
      </div>
      <div class="nav">
        <img v-if="step > 1" class="nav__arrow" :src="ArrowLeft" alt="←" @click="stepSubstract">
        <img class="nav__arrow" :src="ArrowRight" alt="→" @click="stepAdd">
      </div>
    </div>
  </Page>
  <Page v-else>
    <template #title>
      Dziękuję za pomoc!
    </template>
    <div class="content">
      <p>Możesz zaprosić innych znajomych do gry.</p>
      <p>Tak jak wspomniałem na początku, celem mojej pracy będzie zbadanie korelacji wybranych przez Was strategii z waszymi wynikami testu Thomasa Kilmanna.</p>
      <p><strong>Mam nadzieję, że świetnie się bawiłeś przy tym badaniu oraz dowiedziałeś się czegoś ciekawego!</strong></p>
      <p><strong>Dziękuję jeszcze raz za pomoc!</strong></p>
      <p><strong>:D</strong></p>
    </div>
  </Page>
</template>

<script setup>
import Loader from "../components/Loader.vue"
import Page from "./Page.vue";
import Button from "../components/Button.vue";
import {onMounted, ref} from "vue";
import {callApiGET, callApiPOST} from "../../callApi/callApi";
import {code} from "../../composition-api/app";
import ArrowLeft from "../static/ArrowLeft.svg";
import ArrowRight from "../static/ArrowRight.svg";


const test = ref(null);
const i = ref(0);
const answer = ref([]);
const user_id = ref(null);
const room_id = ref(null);
const body = ref({});
const qualities = ref({});
const qualities_percentile = ref ({});
const step = ref(1);

const stepAdd = () => {
  step.value += 1;
}

const stepSubstract = () => {
  step.value -= 1;
}

const getPercentile = (mode, score) => {
  if (mode === 'Rywalizacja') {
    switch (score) {
      case (0): {
        return 1;
      }
      case (1): {
        return 3;
      }
      case (2): {
        return 14;
      }
      case (3): {
        return 24;
      }
      case (4): {
        return 34;
      }
      case (5): {
        return 49;
      }
      case (6): {
        return 59;
      }
      case (7): {
        return 74;
      }
      case (8): {
        return 84;
      }
      case (9): {
        return 89;
      }
      case (10): {
        return 93;
      }
      case (11): {
        return 95;
      }
      case (12): {
        return 99;
      }
    }
  }
  else if (mode === 'Współpraca') {
    switch (score) {
      case (0): {
        return 1;
      }
      case (1): {
        return 3;
      }
      case (2): {
        return 5;
      }
      case (3): {
        return 7;
      }
      case (4): {
        return 9;
      }
      case (5): {
        return 19;
      }
      case (6): {
        return 29;
      }
      case (7): {
        return 49;
      }
      case (8): {
        return 59;
      }
      case (9): {
        return 79;
      }
      case (10): {
        return 89;
      }
      case (11): {
        return 93;
      }
      case (12): {
        return 95;
      }
    }
  }
  else if (mode === 'Kompromis') {
    switch (score) {
      case (0): {
        return 1;
      }
      case (1): {
        return 3;
      }
      case (2): {
        return 5;
      }
      case (3): {
        return 7;
      }
      case (4): {
        return 19;
      }
      case (5): {
        return 29;
      }
      case (6): {
        return 39;
      }
      case (7): {
        return 54;
      }
      case (8): {
        return 74;
      }
      case (9): {
        return 84;
      }
      case (10): {
        return 93;
      }
      case (11): {
        return 95;
      }
      case (12): {
        return 99;
      }
    }
  }
  else if (mode === 'Unikanie') {
    switch (score) {
      case (0): {
        return 1;
      }
      case (1): {
        return 3;
      }
      case (2): {
        return 5;
      }
      case (3): {
        return 14;
      }
      case (4): {
        return 24;
      }
      case (5): {
        return 34;
      }
      case (6): {
        return 54;
      }
      case (7): {
        return 69;
      }
      case (8): {
        return 84;
      }
      case (9): {
        return 93;
      }
      case (10): {
        return 95;
      }
      case (11): {
        return 97;
      }
      case (12): {
        return 99;
      }
    }
  }
  else if (mode === 'Dostosowanie się') {
    switch (score) {
      case (0): {
        return 1;
      }
      case (1): {
        return 3;
      }
      case (2): {
        return 5;
      }
      case (3): {
        return 24;
      }
      case (4): {
        return 39;
      }
      case (5): {
        return 59;
      }
      case (6): {
        return 79;
      }
      case (7): {
        return 89;
      }
      case (8): {
        return 91;
      }
      case (9): {
        return 93;
      }
      case (10): {
        return 95;
      }
      case (11): {
        return 97;
      }
      case (12): {
        return 99;
      }
    }
  }
}

const getQualityPercentile = (qualities) => {
  const values = Object.keys(qualities).map(key => {
    return { [key]: getPercentile(key, qualities[key]) };
  });
  return Object.assign({}, ...values);
};

const pushToBody = async (user_answer) => {
  answer.value.push(user_answer);
  i.value += 1;
  if (i.value === 30) {
    body.value = {user_id, room_id, answer};
    const res_post = await callApiPOST('/finish-test', body.value);
    if (res_post.success) {
      qualities.value = res_post.result.result;
      qualities_percentile.value = getQualityPercentile(qualities.value);
    }
  }
}

const getColor = (i) => {
  if (i === 0) {
    return 'orangered'
  } else if (i === 1) {
    return 'darkorange'
  } else if (i === 2) {
    return 'yellowgreen'
  } else if (i === 3) {
    return 'lightseagreen'
  } else if (i === 4) {
    return 'lightskyblue'
  }
}

const getPoints = (point) => {
  if (point === 2 || point === 3 || point === 4) return 'punkty';
  if (point === 1) return 'punkt';
  return 'punktów';
}

onMounted(async () => {
  const res = await callApiGET('/get-test');
  if (res.success) {
    test.value = res.result.result;
  }
  user_id.value = localStorage.getItem('game-id');
  room_id.value = code.value;
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

  &__results {
    p {
      text-align: start;
    }
  }

  &__intensities {
    margin-top: 24px;
  }
}

.table {
  width: 80%;
  border-collapse: separate;
  border-spacing: 0 8px;


  td {
    text-align: center;
    vertical-align: middle;
    height: 24px;
  }

  &__mode {
    width: 32%;
  }

  &__score {
    width: 10%;
  }

  &__percentiles {
    width: 66%;
  }

  &__percentiles-row {
    td:not(td:nth-child(1)) {
      border-right: solid 2px black;
    }

    td {
      position: relative;

      &:nth-child(3),
      &:nth-child(5){
        width: 14%;
      }

      &:nth-child(4){
        width: 28%;
      }
    }

    td > div {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 12px;
      padding-right: 4px;
    }
  }

  &__quality {
    &__score {
      border: 2px solid black;
    }

    &__percentile {
      position: relative;
    }

    &__bar {
      height: 100%;
    }

    &__label {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
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
</style>
