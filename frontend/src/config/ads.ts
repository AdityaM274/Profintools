export const AD_SLOTS = {
    HOME_HEADER: 'home-header',
    HOME_IN_FEED: 'home-in-feed',
    HOME_FOOTER: 'home-footer',
    HOME_SIDEBAR: 'home-sidebar-affiliate',

    TOOL_HEADER: 'tool-header',
    TOOL_IN_CONTENT: 'tool-in-content',
    TOOL_FOOTER: 'tool-footer',
    TOOL_SIDEBAR: 'tool-sidebar-affiliate',
};

export interface AffiliateAd {
    id: string;
    title: string;
    imageUrl: string;
    link: string;
    description?: string;
}

export const FALLBACK_ADS: { [key: string]: AffiliateAd } = {
    DEFAULT: {
        id: 'default-affiliate',
        title: 'Top Rated Credit Cards',
        imageUrl: 'https://via.placeholder.com/728x90?text=Best+Credit+Cards+Apply+Now',
        link: '#',
        description: 'Get the best rewards and cashback.'
    },
    SIDEBAR: {
        id: 'sidebar-affiliate',
        title: 'Best Demat Account',
        imageUrl: 'https://via.placeholder.com/300x600?text=Open+FREE+Demat+Account',
        link: '#',
        description: 'Zero brokerage on equity delivery.'
    }
};

export const AD_CONFIG = {
    enabled: true,
    googlePublisherId: 'ca-pub-XXXXXXXXXXXXXXXX', // Placeholder
    autoAds: true,
};
