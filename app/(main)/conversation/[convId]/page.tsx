import { ChatPanel } from "@/components/chat/chat-panel"
import { SiteHeader } from "@/components/sidebar/site-header"
import { getMessagesOnServer } from "@/service/server/message.server"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"

export default async function Page({
  params,
}: PageProps<"/conversation/[convId]">) {
  const convId = (await params).convId
  const queryClient = new QueryClient()
  await queryClient.query({
    queryKey: ["messages", convId],
    queryFn: async () => getMessagesOnServer(convId),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SiteHeader convId={convId} />
      <ChatPanel convId={convId} />
    </HydrationBoundary>
  )
}
