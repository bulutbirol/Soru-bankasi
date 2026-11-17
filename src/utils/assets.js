import { Capacitor } from '@capacitor/core'
import { SITE_ORIGIN } from './seo'

// Native builds ship without public/sgs (Play size limit), so images load from the live site.
export function questionImageUrl(path, native = Capacitor.isNativePlatform()) {
  return native ? `${SITE_ORIGIN}${path}` : path
}
