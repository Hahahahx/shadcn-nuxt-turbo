<script setup lang="ts">
import type { DropdownItem } from '@nuxt/ui/dist/runtime/types'

const people = [{
  id: 1,
  name: 'Lindsay Walton',
  title: 'Front-end Developer',
  email: 'lindsay.walton@example.com',
  role: 'Member',
}, {
  id: 2,
  name: 'Courtney Henry',
  title: 'Designer',
  email: 'courtney.henry@example.com',
  role: 'Admin',
}, {
  id: 3,
  name: 'Tom Cook',
  title: 'Director of Product',
  email: 'tom.cook@example.com',
  role: 'Member',
}, {
  id: 4,
  name: 'Whitney Francis',
  title: 'Copywriter',
  email: 'whitney.francis@example.com',
  role: 'Admin',
}, {
  id: 5,
  name: 'Leonard Krasner',
  title: 'Senior Designer',
  email: 'leonard.krasner@example.com',
  role: 'Owner',
}, {
  id: 6,
  name: 'Floyd Miles',
  title: 'Principal Designer',
  email: 'floyd.miles@example.com',
  role: 'Member',
}, {
  id: 7,
  name: 'Emily Selman',
  title: 'VP, User Experience',
  email: '',
  role: 'Admin',
}, {
  id: 8,
  name: 'Kristin Watson',
  title: 'VP, Human Resources',
  email: '',
  role: 'Member',
}, {
  id: 9,
  name: 'Emma Watson',
  title: 'Front-end Developer',
  email: '',
  role: 'Member',
}, {
  id: 10,
  name: 'John Doe',
  title: 'Designer',
  email: '',
  role: 'Admin',
}, {
  id: 11,
  name: 'Jane Doe',
  title: 'Director of Product',
  email: '',
  role: 'Member',
}, {
  id: 12,
  name: 'John Smith',
  title: 'Copywriter',
  email: '',
  role: 'Admin',
}, {
  id: 13,
  name: 'Jane Smith',
  title: 'Senior Designer',
  email: '',
  role: 'Owner',
}]

type Item = keyof typeof people[0]

function menus(): DropdownItem[][] {
  return [
    [{
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
    }, {
      label: 'Duplicate',
      icon: 'i-heroicons-document-duplicate-20-solid',
    }],
    [{
      label: 'Archive',
      icon: 'i-heroicons-archive-box-20-solid',
    }, {
      label: 'Move',
      icon: 'i-heroicons-arrow-right-circle-20-solid',
    }],
    [{
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
    }],
  ]
}

const columns: {
  key: Item
  label?: string
}[] = [{
  key: 'id',
  label: 'ID',
}, {
  key: 'name',
  label: 'Name',
}, {
  key: 'title',
  label: 'Title',
}, {
  key: 'email',
  label: 'Email',
}, {
  key: 'role',
  label: 'Role',
}]

const selected = ref([people[1]])
const query = ref('')

const isDetailOpen = ref(false)
</script>

<template>
  <CommonTableBase
    v-model:selected="selected"
    v-model:query="query"
    :list="people" :page-total="people.length" :columns="columns" :menus="menus"
  >
    <template #name-data="{ row }">
      <UButton variant="link" @click="isDetailOpen = true">
        {{ row.name }}
      </UButton>
    </template>
  </CommonTableBase>
</template>
