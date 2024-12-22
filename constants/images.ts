import { ImageSourcePropType } from 'react-native';

import profile from '../assets/images/profile.png';
import thumbnail from '../assets/images/thumbnail.png';
import cards from '../assets/images/cards.jpeg';
import path from '../assets/images/path.png';
import logo from '../assets/images/logo.png';
import logoSmall from '../assets/images/logo-small.png';
import empty from '../assets/images/empty.png';

interface Images {
    profile: ImageSourcePropType;
    thumbnail: ImageSourcePropType;
    cards: ImageSourcePropType;
    path: ImageSourcePropType;
    logo: ImageSourcePropType;
    logoSmall: ImageSourcePropType;
    empty: ImageSourcePropType;
}

const images: Images = { profile, thumbnail, cards, path, logo, logoSmall, empty };

export default images;
