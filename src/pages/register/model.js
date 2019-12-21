import { router, pathMatchRegexp } from 'utils'
import api from 'api'

const { registerUser } = api

export default {
  namespace: 'register',

  state: {},

  effects: {
    *register({ payload }, { put, call, select }) {
      const data = yield call(registerUser, payload)
      if (data.success) {
        return true
      } else {
        throw data
      }
    },
    *registerSuccess({ payload }, { put, call, select }) {
      const { locationQuery } = yield select(_ => _.app)
      const { from } = locationQuery
      if (!pathMatchRegexp('/register', from)) {
        if (!from || ['', '/'].includes(from)) {
          router.push('/login')
        } else {
          router.push(from)
        }
      } else {
        router.push('/login')
      }
    },
    *redirect({ payload }, { put, call, select }) {
      router.push('/login')
    },
  },
}
