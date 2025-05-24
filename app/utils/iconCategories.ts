import { IconType } from 'react-icons';
import {
  FaHeartbeat,
  FaTooth,
  FaEye,
  FaStethoscope,
  FaPills,
  FaSyringe,
  FaThermometerHalf,
  FaBrain,
  FaDumbbell,
  FaRunning,
  FaBiking,
  FaSwimmer,
  FaWalking,
  FaLeaf,
  FaHiking,
  FaCut,
  FaSprayCan,
  FaHandPaper,
  FaPaintBrush,
  FaSoap,
  FaBath,
  FaBroom,
  FaSnowflake,
  FaBed,
  FaTshirt,
  FaTrash,
  FaCouch,
  FaHome,
  FaWrench,
  FaLaptop,
  FaBook,
  FaPen,
  FaClipboard,
  FaCalendar,
  FaBriefcase,
  FaUsers,
  FaPhone,
  FaGift,
  FaHeart,
  FaComments,
} from 'react-icons/fa';

export interface IconCategory {
  name: string;
  icons: { name: string; component: IconType }[];
}

export const iconCategories: IconCategory[] = [
  {
    name: 'Здоровье',
    icons: [
      { name: 'FaHeartbeat', component: FaHeartbeat },
      { name: 'FaTooth', component: FaTooth },
      { name: 'FaEye', component: FaEye },
      { name: 'FaStethoscope', component: FaStethoscope },
      { name: 'FaPills', component: FaPills },
      { name: 'FaSyringe', component: FaSyringe },
      { name: 'FaThermometerHalf', component: FaThermometerHalf },
      { name: 'FaBrain', component: FaBrain },
    ],
  },
  {
    name: 'Фитнес',
    icons: [
      { name: 'FaDumbbell', component: FaDumbbell },
      { name: 'FaRunning', component: FaRunning },
      { name: 'FaBiking', component: FaBiking },
      { name: 'FaSwimmer', component: FaSwimmer },
      { name: 'FaWalking', component: FaWalking },
      { name: 'FaLeaf', component: FaLeaf },
      { name: 'FaHiking', component: FaHiking },
    ],
  },
  {
    name: 'Уход за собой',
    icons: [
      { name: 'FaCut', component: FaCut },
      { name: 'FaSprayCan', component: FaSprayCan },
      { name: 'FaHandPaper', component: FaHandPaper },
      { name: 'FaPaintBrush', component: FaPaintBrush },
      { name: 'FaSoap', component: FaSoap },
      { name: 'FaBath', component: FaBath },
    ],
  },
  {
    name: 'Домашние дела',
    icons: [
      { name: 'FaBroom', component: FaBroom },
      { name: 'FaSnowflake', component: FaSnowflake },
      { name: 'FaBed', component: FaBed },
      { name: 'FaTshirt', component: FaTshirt },
      { name: 'FaTrash', component: FaTrash },
      { name: 'FaCouch', component: FaCouch },
      { name: 'FaHome', component: FaHome },
      { name: 'FaWrench', component: FaWrench },
    ],
  },
  {
    name: 'Работа/Учеба',
    icons: [
      { name: 'FaLaptop', component: FaLaptop },
      { name: 'FaBook', component: FaBook },
      { name: 'FaPen', component: FaPen },
      { name: 'FaClipboard', component: FaClipboard },
      { name: 'FaCalendar', component: FaCalendar },
      { name: 'FaBriefcase', component: FaBriefcase },
    ],
  },
  {
    name: 'Социальное',
    icons: [
      { name: 'FaUsers', component: FaUsers },
      { name: 'FaPhone', component: FaPhone },
      { name: 'FaGift', component: FaGift },
      { name: 'FaHeart', component: FaHeart },
      { name: 'FaComments', component: FaComments },
    ],
  },
];

export const getRandomIcon = () => {
  const allIcons = iconCategories.flatMap(category => category.icons);
  const randomIndex = Math.floor(Math.random() * allIcons.length);
  return allIcons[randomIndex];
}; 