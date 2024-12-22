import { ImageSourcePropType } from 'react-native';

import profile from '../assets/images/profile.png';
import thumbnail from '../assets/images/thumbnail.png';
import cards from '../assets/images/cards.jpeg';
import path from '../assets/images/path.png';
import logo from '../assets/images/logo.png';
import empty from '../assets/images/empty.png';

interface Images {
    profile: ImageSourcePropType;
    thumbnail: ImageSourcePropType;
    cards: ImageSourcePropType;
    path: ImageSourcePropType;
    logo: ImageSourcePropType;
    empty: ImageSourcePropType;
}

const images: Images = { profile, thumbnail, cards, path, logo, empty };

export default images;
