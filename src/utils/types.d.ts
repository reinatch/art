export type Media = {
  ID: number;
  id: number;
  title: string;
  filename: string;
  filesize: number;
  url: string;
  link: string;
  alt: string;
  author: string;
  description: string;
  caption: string;
  name: string;
  status: string;
  uploaded_to: number;
  date: string;
  modified: string;
  menu_order: number;
  mime_type: string;
  type: string;
  subtype: string;
  icon: string;
  width: number;
  height: number;
  sizes: {
    thumbnail: string;
    "thumbnail-width": number;
    "thumbnail-height": number;
    medium: string;
    "medium-width": number;
    "medium-height": number;
    medium_large: string;
    "medium_large-width": number;
    "medium_large-height": number;
    large: string;
    "large-width": number;
    "large-height": number;
    "1536x1536": string;
    "1536x1536-width": number;
    "1536x1536-height": number;
    "2048x2048": string;
    "2048x2048-width": number;
    "2048x2048-height": number;
  };
  base64: string;
}
export interface Link {
  title: string;
  url: string;
  target: string;
}
export interface AboutSection {
  title: string;
  link: Link;
}
export interface AboutSectionWithSubtitle extends AboutSection {
  subtitle: string;
  image: number;
}
export interface ProductionSection {
  title: string;
  subtitle: string;
  poster: Media;
  video: Media;
  mov: Media;
  link: Link;
}
export interface ProjectItem {
  ID: number;
  post_author: string;
  post_date: string;
  post_date_gmt: string;
  post_content: string;
  post_title: string;
  post_excerpt: string;
  post_status: string;
  comment_status: string;
  ping_status: string;
  post_password: string;
  post_name: string;
  to_ping: string;
  pinged: string;
  post_modified: string;
  post_modified_gmt: string;
  post_content_filtered: string;
  post_parent: number;
  guid: string;
  menu_order: number;
  post_type: string;
  post_mime_type: string;
  comment_count: string;
  filter: string;
}
export interface ProjectSection {
  title: string;
  subtitle: string;
  items: number[];
  items0: number[];
  thumbnails: string[];
  link: Link;
}
export interface ResidencySection {
  title: string;
  subtitle: string;
  images: Media[];
  link: Link;
}
export interface ACFData {
  home_splash: {
    poster: Media;
    video: Media;
    mov: Media;
  };
  about0: AboutSection;
  about1: AboutSectionWithSubtitle;
  production0: ProductionSection;
  production1: {
    title: string;
  };
  project0: ProjectSection;
  project1: ProjectSection;
  residency0: ResidencySection;
}
export interface HomePageData {
  items: number[];
  items0: number[];
  link: Link;
  image: string;
  subtitle: string;
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  featured_media: number;
  acf: ACFData;
}
interface GalleryImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}
interface ContentItem {
  title: string;
  content: string;
  video?: { url: string };
  image?: GalleryImage;
}
interface ACF {
  conteudo: ContentItem[];
  galeria: GalleryImage[];
  title: string;
}
export interface AboutTabData {
  id: string; 
  slug: string;
  title: {
    rendered: string;
  };
  acf: ACF;
}
export type Page = {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  template: string;
  meta: unknown[];
};
export type ImageMedia = {
    ID: number;
    id: number;
    title: string;
    filename: string;
    filesize: number;
    url: string;
    link: string;
    alt: string;
    author: string;
    description: string;
    caption: string;
    name: string;
    status: string;
    uploaded_to: number;
    date: string;
    modified: string;
    menu_order: number;
    mime_type: string;
    type: string;
    subtype: string;
    icon: string;
    width: number;
    height: number;
    sizes: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
    base64: string;
};
type FilterBarProps = {
  authors: Author[];
  tags: Tag[];
  categories: Category[];
  selectedAuthor?: string;
  selectedTag?: string;
  selectedCategory?: string;
};
export type Artista = {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: "artistas"; 
  parent: number;
  meta: unknown[];
  acf: unknown[]; 
  _links: {
    self: { href: string }[];
    collection: { href: string }[];
    about: { href: string }[];
    "wp:post_type": { href: string }[]; 
    curies: { name: string; href: string; templated: boolean }[];
  };
};
export type Material = {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: "materiais"; 
  parent: number;
  meta: unknown[];
  acf: unknown[]; 
  _links: {
    self: { href: string }[];
    collection: { href: string }[];
    about: { href: string }[];
    "wp:post_type": { href: string }[]; 
    curies: { name: string; href: string; templated: boolean }[];
  };
};
export type Projecto = {
  lang: string;
  translations: unknown;
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  type: "projectos"; 
  link: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  template: string;
  featured_image: {
    url:string;
    width:number;
    height:number;
    blurDataURL:string;
  };
  format: "standard";
  meta: unknown[];
  materiais: number[]; 
  artistas: number[]; 
  class_list: string[]; 
  acf: {
    [x: string]: ReactNode;
    rightField: ReactNode;
    page_title: string;
    year: string;
    location: string;
    right_field: string;
    galeria: {
      base64: string;
      ID: number;
      id: number;
      title: string;
      filename: string;
      filesize: number;
      url: string;
      link: string;
      alt: string;
      author: string;
      description: string;
      caption: string;
      name: string;
      status: string;
      uploaded_to: number;
      date: string;
      modified: string;
      menu_order: number;
      mime_type: string;
      type: string;
      subtype: string;
      icon: string;
      width: number;
      height: number;
      sizes: {
        thumbnail: string;
        "thumbnail-width": number;
        "thumbnail-height": number;
        medium: string;
        "medium-width": number;
        "medium-height": number;
        medium_large: string;
        "medium_large-width": number;
        "medium_large-height": number;
        large: string;
        "large-width": number;
        "large-height": number;
        "1536x1536": string;
        "1536x1536-width": number;
        "1536x1536-height": number;
        "2048x2048": string;
        "2048x2048-width": number;
        "2048x2048-height": number;
      };
    }[];
  };
  _links: {
    self: { href: string }[];
    collection: { href: string }[];
    about: { href: string }[];
    author: { embeddable: boolean; href: string }[];
    "acf:attachment": { embeddable: boolean; href: string }[];
    "wp:featuredmedia": { embeddable: boolean; href: string }[];
    "wp:attachment": { href: string }[];
    "wp:term": { taxonomy: string; embeddable: boolean; href: string }[];
    curies: { name: string; href: string; templated: boolean }[];
  };
};
export type homeProjecto = {
  thumbnail: string;
  lang: string;
  translations: unknown;
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  type: "projectos"; 
  link: string;
  title:  string;
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  template: string;
  featured_image: {
    url:string;
    width:number;
    height:number;
  };
  format: "standard";
  meta: unknown[];
  materiais: number[]; 
  artistas: number[]; 
  class_list: string[]; 
  acf: {
    [x: string]: ReactNode;
    rightField: ReactNode;
    page_title: string;
    year: string;
    location: string;
    right_field: string;
    galeria: {
      ID: number;
      id: number;
      title: string;
      filename: string;
      filesize: number;
      url: string;
      link: string;
      alt: string;
      author: string;
      description: string;
      caption: string;
      name: string;
      status: string;
      uploaded_to: number;
      date: string;
      modified: string;
      menu_order: number;
      mime_type: string;
      type: string;
      subtype: string;
      icon: string;
      width: number;
      height: number;
      sizes: {
        [key: string]: {
          file: string;
          width: number;
          height: number;
          mime_type: string;
          source_url: string;
        };
      };
    }[];
  };
  _links: {
    self: { href: string }[];
    collection: { href: string }[];
    about: { href: string }[];
    author: { embeddable: boolean; href: string }[];
    "acf:attachment": { embeddable: boolean; href: string }[];
    "wp:featuredmedia": { embeddable: boolean; href: string }[];
    "wp:attachment": { href: string }[];
    "wp:term": { taxonomy: string; embeddable: boolean; href: string }[];
    curies: { name: string; href: string; templated: boolean }[];
  };
};
