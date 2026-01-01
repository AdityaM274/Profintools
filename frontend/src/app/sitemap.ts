import { MetadataRoute } from 'next';
import { TOOLS } from '@/constants/tools';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://profintools.com';

    const toolPages = TOOLS.map((tool) => ({
        url: `${baseUrl}/tools/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/premium`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...toolPages,
    ];
}
