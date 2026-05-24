"use client";

type CarouselProgressProps = {
  total: number;
  activeIndex: number;
  onSelect?: (index: number) => void;
};

export function CarouselProgress({ total, activeIndex, onSelect }: CarouselProgressProps) {
  return (
    <div className="ev-carousel__progress">
      <span className="ev-carousel__progress-index">{String(activeIndex + 1).padStart(2, "0")}</span>
      <div className="ev-carousel__progress-bar" role="tablist">
        {Array.from({ length: total }).map((_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Slide ${index + 1}`}
            onClick={() => onSelect?.(index)}
            className="ev-carousel__progress-tick"
          >
            <span className="ev-carousel__progress-track" />
            <span
              className="ev-carousel__progress-fill"
              style={{ width: index === activeIndex ? "100%" : "0%" }}
            />
          </button>
        ))}
      </div>
      <span className="ev-carousel__progress-total">{String(total).padStart(2, "0")}</span>
    </div>
  );
}
