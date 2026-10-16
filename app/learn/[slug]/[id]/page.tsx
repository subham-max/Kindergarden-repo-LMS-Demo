"use client";

import { useParams, notFound } from "next/navigation";
import { categories } from "@/lib/data";
import LetterLesson from "@/components/lessons/LetterLesson";
import NumberLesson from "@/components/lessons/NumberLesson";
import TopicLesson from "@/components/lessons/TopicLesson";
import DressStudio from "@/components/DressStudio";

// /learn/{module}/{item}: each module picks its own lesson template.
export default function LessonPage() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  if (!categories.some((c) => c.slug === slug)) return notFound();

  const itemId = decodeURIComponent(id);
  if (slug === "alphabet") return <LetterLesson id={itemId} />;
  if (slug === "numbers") return <NumberLesson id={itemId} />;
  if (slug === "dress") return <DressStudio initialId={itemId} />; // dress-up studio instead of a lesson page
  return <TopicLesson slug={slug} id={itemId} />;
}
