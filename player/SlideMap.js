
// src/slides/SlideMap.js
import Quote from './slides/Quote.svelte';
import CornerWords from './slides/CornerWords.svelte';
import Title from './slides/Title.svelte';
import Image from './slides/Image.svelte';
import ImageLeftBulletsRight from './slides/ImageLeftBulletsRight.svelte';
import ImageRightBulletsLeft from './slides/ImageRightBulletsLeft.svelte';
import ImageWithCaption from './slides/ImageWithCaption.svelte';
import ImageWithTitle from './slides/ImageWithTitle.svelte';
import Table from './slides/Table.svelte';
import StatisticSlide from './slides/StatisticSlide.svelte';
import BarChartSlide from './slides/BarChartSlide.svelte';
import TwoColumnTextSlide from './slides/TwoColumnTextSlide.svelte';
import DonutChartSlide from './slides/DonutChartSlide.svelte';
import TitleAndSubtitle from './slides/TitleAndSubtitle.svelte';
import BulletList from './slides/BulletList.svelte';
import BigNumber from './slides/BigNumber.svelte';
import QuoteWithImage from './slides/QuoteWithImage.svelte';
import ContactSlide from './slides/ContactSlide.svelte';
import FillImage from './slides/FillImage.svelte';
import Eq from './slides/eq/Eq.svelte';

export default {
  fillImage:FillImage,
  eq: Eq,
  quoteSlide: Quote,
  cornerWordsSlide: CornerWords,
  titleSlide: Title,
  imageSlide: Image,
  imageLeftBulletsRight: ImageLeftBulletsRight,
  imageRightBulletsLeft: ImageRightBulletsLeft,
  imageWithCaption: ImageWithCaption,
  imageWithTitle: ImageWithTitle,
  table: Table,
  statistic: StatisticSlide,
  barChart: BarChartSlide,
  twoColumnText: TwoColumnTextSlide,
  donutChart: DonutChartSlide,
  titleAndSubtitle: TitleAndSubtitle,
  bulletList: BulletList,
  bigNumber: BigNumber,
  quoteWithImage: QuoteWithImage,
  contactSlide: ContactSlide
};
