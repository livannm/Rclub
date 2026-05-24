"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselControlsProps = {
  onPrev: () => void;
  onNext: () => void;
  prevLabel?: string;
  nextLabel?: string;
};

export function CarouselControls({ onPrev, onNext, prevLabel = "Précédent", nextLabel = "Suivant" }: CarouselControlsProps) {
  return (
    <>
      <button type="button" onClick={onPrev} aria-label={prevLabel} className="ev-carousel__btn">
        <ChevronLeft size={16} strokeWidth={1.5} aria-hidden />
      </button>
      <button type="button" onClick={onNext} aria-label={nextLabel} className="ev-carousel__btn">
        <ChevronRight size={16} strokeWidth={1.5} aria-hidden />
      </button>
    </>
  );
}
