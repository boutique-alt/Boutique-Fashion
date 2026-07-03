import { useCallback, useEffect, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { fetchProfileByEmail, subscribeProfileChanged } from '../services/profileService'

export function useUserProfile() {
  const { user } = useStore()
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>()

  const load = useCallback(() => {
    if (!user) {
      setAvatarUrl(undefined)
      return
    }

    fetchProfileByEmail(user.email)
      .then((profile) => setAvatarUrl(profile?.avatarUrl))
      .catch(() => setAvatarUrl(undefined))
  }, [user])

  useEffect(() => {
    load()
    window.addEventListener('focus', load)
    const unsubscribe = subscribeProfileChanged(load)
    return () => {
      window.removeEventListener('focus', load)
      unsubscribe()
    }
  }, [load])

  return { avatarUrl }
}
