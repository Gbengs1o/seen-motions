import { ArrowRight } from 'lucide-react';
import HeroScrollAnimation from './HeroScrollAnimation';

type HeroProps = {
  hero: {
    title: string;
    subtitle: string;
    button: string;
    buttonHref: string;
    backgroundVideoUrl?: string;
  };
};

function SeenOwlMark() {
  return (
    <svg
      className="block h-full w-full"
      width="6037"
      height="5892"
      viewBox="0 0 6037 5892"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="3019" width="3018" height="5892" fill="black" />
      <rect width="3018" height="5892" fill="white" />

      <path
        d="M1782.8 1213C1782.73 1316.5 1770.52 1415.38 1790.25 1518.58C1839.91 1778.29 2017.75 1977.95 2237.58 2121C2424.89 2242.89 2638.9 2323 2816.4 2459.59C2892.97 2518.52 2972.85 2587.78 3011.3 2677.47C3030.95 2631.76 3016.17 2566.15 2999.19 2521.8C2955.81 2408.48 2884.27 2312.08 2802.9 2221.98C2596.46 1993.41 2302.99 1855.19 2078.11 1645.2C1993.84 1566.5 1915.7 1474.04 1858.77 1374.44C1829.47 1323.19 1814.28 1261.83 1782.8 1213Z"
        fill="black"
      />
      <path
        d="M1930.46 2066.31C1722.95 2494.29 1861.67 3018.42 2208.14 3334.75C2358 3471.58 2546.75 3549.31 2721.89 3648.54C2787.65 3685.8 2852.36 3724.47 2916.8 3763.85C2949.95 3784.11 2981.15 3810.02 3017.21 3824.83V3686.45C3017.21 3668.55 3021.94 3642.24 3011.13 3626.55C2998.87 3608.73 2970.4 3597.77 2952.24 3586.6C2899.98 3554.47 2846.44 3524.35 2792.77 3494.57C2625.15 3401.55 2449.23 3322.41 2308.46 3190.38C2146.8 3038.75 2038.81 2825.17 2012.23 2608.28C2007.69 2571.3 2000.61 2530.14 2002.57 2492.97C2006.03 2427.26 2013.85 2360.96 2030.24 2296.94C2041.09 2254.58 2059.77 2213.25 2066.3 2170.09C2014.29 2142.96 1973.35 2104.99 1930.46 2066.31Z"
        fill="black"
      />
      <path
        d="M2208.05 2343.06C2201.13 2393.25 2184.6 2441.68 2184.6 2492.97C2184.6 2618.9 2253.04 2744.04 2361.61 2812.68C2457.02 2873.01 2587.48 2878.23 2692.36 2838.51C2722.3 2827.17 2780.45 2801.96 2791.26 2769.63C2801.42 2739.22 2742.56 2695.01 2721.9 2678.35C2713.25 2671.38 2704.2 2664.54 2692.36 2665.23C2675.94 2666.2 2659.94 2680.14 2645.11 2686.3C2620.12 2696.7 2595.35 2700.69 2568.33 2700.5C2438.22 2699.61 2344.29 2580.53 2367.52 2458.38C2310.13 2423.97 2262.53 2380.49 2208.05 2343.06Z"
        fill="black"
      />
      <path
        d="M2751.43 2971.52C2819.17 3129.52 2937.07 3266.03 3011.3 3421.23C3023.62 3392.58 3017.21 3354.06 3017.21 3323.22V3156.02C3017.21 3128.47 3021.99 3095.86 3012.38 3069.53C2988.48 3004.05 2932.56 2946.44 2899.08 2885.03C2845.77 2902.69 2804.61 2949.78 2751.43 2971.52Z"
        fill="black"
      />

      <path
        d="M4265.07 1220.03C4265.14 1323.54 4277.36 1422.42 4257.63 1525.61C4207.97 1785.32 4030.12 1984.98 3810.29 2128.03C3622.98 2249.92 3408.98 2330.04 3231.48 2466.62C3154.9 2525.55 3075.03 2594.81 3036.57 2684.5C3016.93 2638.8 3031.7 2573.18 3048.68 2528.83C3092.06 2415.51 3163.6 2319.11 3244.97 2229.02C3451.41 2000.44 3744.89 1862.22 3969.76 1652.23C4054.03 1573.53 4132.18 1481.08 4189.11 1381.47C4218.4 1330.22 4233.59 1268.87 4265.07 1220.03Z"
        fill="white"
      />
      <path
        d="M4117.42 2073.34C4324.92 2501.33 4186.2 3025.46 3839.74 3341.78C3689.87 3478.61 3501.13 3556.34 3325.98 3655.57C3260.23 3692.83 3195.51 3731.5 3131.08 3770.88C3097.93 3791.14 3066.73 3817.05 3030.67 3831.86V3693.48C3030.67 3675.58 3025.94 3649.27 3036.74 3633.58C3049 3615.76 3077.47 3604.8 3095.64 3593.63C3147.89 3561.5 3201.43 3531.38 3255.11 3501.6C3422.73 3408.58 3598.65 3329.44 3739.41 3197.42C3901.07 3045.79 4009.06 2832.2 4035.65 2615.31C4040.18 2578.33 4047.26 2537.17 4045.31 2500C4041.85 2434.29 4034.02 2368 4017.63 2303.97C4006.79 2261.61 3988.1 2220.28 3981.58 2177.12C4033.59 2149.99 4074.52 2112.02 4117.42 2073.34Z"
        fill="white"
      />
      <path
        d="M3839.82 2350.09C3846.75 2400.28 3863.28 2448.71 3863.28 2500C3863.28 2625.93 3794.84 2751.07 3686.26 2819.72C3590.85 2880.04 3460.39 2885.26 3355.51 2845.54C3325.57 2834.2 3267.43 2808.99 3256.62 2776.66C3246.45 2746.26 3305.31 2702.04 3325.98 2685.38C3334.62 2678.41 3343.67 2671.57 3355.51 2672.27C3371.94 2673.23 3387.94 2687.17 3402.76 2693.33C3427.75 2703.73 3452.53 2707.72 3479.54 2707.53C3609.66 2706.64 3703.58 2587.56 3680.35 2465.41C3737.75 2431 3785.34 2387.52 3839.82 2350.09Z"
        fill="white"
      />
      <path
        d="M3296.45 2978.55C3228.7 3136.55 3110.8 3273.06 3036.57 3428.27C3024.26 3399.62 3030.67 3361.1 3030.67 3330.25V3163.05C3030.67 3135.5 3025.89 3102.89 3035.5 3076.56C3059.39 3011.08 3115.31 2953.47 3148.79 2892.06C3202.1 2909.72 3243.27 2956.82 3296.45 2978.55Z"
        fill="white"
      />
    </svg>
  );
}

export default function Hero({ hero }: HeroProps) {
  const titleLines = hero.title.split('\n');
  const titleLabel = titleLines.join(' ');
  const [subtitleLead, subtitleRest = ''] = hero.subtitle.split('. ');
  const subtitleTail = subtitleRest || '';

  return (
    <section
      id="top"
      className="hero-scroll-section relative h-[calc(780px+220vh)] bg-[#f7f7f7] md:h-[calc(860px+220vh)]"
    >
      <HeroScrollAnimation />

      <div className="hero-scroll-stage sticky top-[134px] isolate h-[780px] overflow-hidden bg-[#f7f7f7] md:top-[69px] md:h-[860px]">
        {hero.backgroundVideoUrl ? (
          <video
            className="hero-background-scroll absolute inset-0 -z-20 h-full w-full object-cover opacity-[0.18] mix-blend-luminosity"
            src={hero.backgroundVideoUrl}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : null}

        <div className="hero-background-scroll absolute top-0 bottom-[-160px] left-0 -z-30 w-1/2 bg-[#f7f7f7]" />
        <div className="hero-background-scroll absolute top-0 right-0 bottom-[-160px] -z-30 w-1/2 bg-black" />

        <div className="absolute top-[96px] left-1/2 h-[190px] w-[190px] -translate-x-1/2 md:top-[110px] md:h-[270px] md:w-[270px]">
          <div className="hero-logo-scroll-motion flex h-full w-full items-center justify-center overflow-hidden bg-[linear-gradient(to_right,#fff_0_50%,#000_50%_100%)] drop-shadow-[-24px_34px_28px_rgba(0,0,0,0.22)]">
            <SeenOwlMark />
          </div>
        </div>

        <div className="absolute top-[350px] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center text-center md:top-[415px]">
          <div className="hero-text-scroll-motion flex flex-col items-center">
            <h1
              className="font-canela relative origin-center text-[56px] font-black uppercase leading-[0.82] text-transparent md:scale-x-[1.32] md:text-[112px]"
              aria-label={titleLabel}
            >
              <span className="invisible block" aria-hidden="true">
                {titleLines.map((line) => (
                  <span className="block" key={line}>
                    {line}
                  </span>
                ))}
              </span>
              <span
                className="absolute inset-0 text-black [clip-path:inset(0_50%_0_0)]"
                aria-hidden="true"
              >
                {titleLines.map((line) => (
                  <span className="block" key={line}>
                    {line}
                  </span>
                ))}
              </span>
              <span
                className="absolute inset-0 text-white [clip-path:inset(0_0_0_50%)]"
                aria-hidden="true"
              >
                {titleLines.map((line) => (
                  <span className="block" key={line}>
                    {line}
                  </span>
                ))}
              </span>
            </h1>

            <p
              className="font-sohne relative mt-9 grid w-screen grid-cols-2 text-[16px] leading-none md:mt-8 md:text-[22px]"
              aria-label={hero.subtitle}
            >
              <span className="pr-px text-right text-black" aria-hidden="true">
                {subtitleLead}
              </span>
              <span
                className="absolute top-0 left-1/2 inline-block w-[0.28em] -translate-x-1/2 text-transparent"
                aria-hidden="true"
              >
                <span className="invisible">.</span>
                <span className="absolute inset-0 text-black [clip-path:inset(0_50%_0_0)]">.</span>
                <span className="absolute inset-0 text-white [clip-path:inset(0_0_0_50%)]">.</span>
              </span>
              <span className="pl-[0.32em] text-left text-white" aria-hidden="true">
                {subtitleTail}
              </span>
            </p>
          </div>

          <div className="hero-button-scroll-motion mt-[104px] md:mt-[86px]">
            <a
            className="premium-button premium-button-gold inline-flex h-[60px] min-w-[270px] items-center justify-center gap-8 px-8 text-[13px] font-black uppercase tracking-[0.2em] md:h-[58px] md:min-w-[250px] md:gap-7 md:text-[12px]"
            href={hero.buttonHref}
          >
              <span>{hero.button}</span>
              <ArrowRight className="h-6 w-6 md:h-5 md:w-5" strokeWidth={2.25} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
