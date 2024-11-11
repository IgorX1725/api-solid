import { Environment } from 'vitest/environments'

export default <Environment>{
  name: 'prisma',
  transformMode: 'web',
  async setup() {
    console.log('Executed')

    return {
      teardown() {
        console.log('Teardown')
      },
    }
  },
}
