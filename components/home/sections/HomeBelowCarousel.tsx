import { HomePracticalInfo } from "./HomePracticalInfo";
import { HomeExperience } from "./HomeExperience";
import { HomeInsideClub } from "./HomeInsideClub";
import { HomeFinalCta } from "./HomeFinalCta";

export function HomeBelowCarousel() {
  return (
    <div className="home-below-carousel">
      <HomePracticalInfo />
      <HomeExperience />
      <HomeInsideClub />
      <HomeFinalCta />
    </div>
  );
}
