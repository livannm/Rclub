import { HomeExperience } from "./HomeExperience";
import { HomePracticalInfo } from "./HomePracticalInfo";
import { HomeInsideClub } from "./HomeInsideClub";
import { HomeFinalCta } from "./HomeFinalCta";

export function HomeBelowCarousel() {
  return (
    <div className="home-below-carousel">
      <HomeExperience />
      <HomePracticalInfo />
      <HomeInsideClub />
      <HomeFinalCta />
    </div>
  );
}
