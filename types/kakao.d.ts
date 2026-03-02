// Kakao JavaScript SDK type declarations
interface KakaoChannel {
  followChannel(params: { channelPublicId: string }): Promise<{ success: boolean }>
  addChannel(params: { channelPublicId: string }): void
  chat(params: { channelPublicId: string }): void
}

interface KakaoAPI {
  request(params: { url: string }): Promise<unknown>
}

interface KakaoSDK {
  init(appKey: string): void
  isInitialized(): boolean
  Channel: KakaoChannel
  API: KakaoAPI
}

interface Window {
  Kakao: KakaoSDK
}
