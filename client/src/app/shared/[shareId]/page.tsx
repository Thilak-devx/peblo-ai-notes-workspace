import { SharedNoteView } from "@/components/notes/shared-note-view";

export default async function SharedNotePage(
  props: PageProps<"/shared/[shareId]">,
) {
  const { shareId } = await props.params;

  return <SharedNoteView shareId={shareId} />;
}
