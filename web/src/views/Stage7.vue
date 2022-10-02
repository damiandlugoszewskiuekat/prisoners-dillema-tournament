<template>
  <Loader class="content" v-if="test === null"/>
  <Page v-else>
    <template #title>
      {{i < 30 ? `Test Thomasa-Kilmanna - pytanie ${i + 1} z ${test.length}` : 'Dziękuję Ci za pomoc w badaniu!'}}
    </template>
    <div class="content" v-if="i < 30">
      <p>Wybierz odpowiedź, która jest najbardziej charakterystyczna dla Twojego własnego zachowania.</p>
      <p>W wielu przypadkach ani zdanie "A", ani zdanie "B" może być nietypowe dla Twojego zachowania, ale proszę wybrać to, którego użycie przez Ciebie byłoby bardziej prawdopodobne.</p>
      <Button @click="pushToBody('A')">{{ test[i].a }}</Button>
      <Button @click="pushToBody('B')">{{ test[i].b }}</Button>
    </div>
    <div class="content" v-else>
      <p>Twój styl rozwiązywania konfliktów to:</p>
      <p v-if="quality"><strong>{{quality}}</strong></p>
      <p>Możesz zaprosić innych znajomych do gry.</p>
      <p><strong>Mam nadzieję, że świetnie się bawiłeś przy tym badaniu!</strong></p>
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


const test = ref(null);
const i = ref(0);
const answer = ref([]);
const user_id = ref(null);
const room_id = ref(null);
const body = ref({});
const quality = ref({});

const getQuality = (quality) => {
  const features = {
    competition: 'Rywalizacja',
    cooperation: 'Współpraca',
    compromise: 'Kompromis',
    avoidance: 'Unikanie',
    quadrating: 'Dostosowanie się'
  }
  const max = Math.max(...Object.values(quality));
  const maxEntries = Object.entries(quality).filter(([key, val]) => val === max);
  return maxEntries.reduce((result, [key]) => [...result, features[key]], []).join(', ')
};

const pushToBody = async (user_answer) => {
  answer.value.push(user_answer);
  i.value += 1;
  if (i.value === 30) {
    body.value = {user_id, room_id, answer};
    const res_post = await callApiPOST('/finish-test', body.value);
    if (res_post.success) {
      quality.value = getQuality(res_post.result.result);
    }
  }
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
}
</style>
