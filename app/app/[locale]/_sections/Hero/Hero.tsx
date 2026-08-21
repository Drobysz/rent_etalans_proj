"use client";

import { useEffect, useState } from 'react';
import s from './style.module.scss';
import { TitleBar } from './_components';
import { motion } from 'framer-motion';
import { PathService } from '@/helpers/path';
import { ViewReveal } from '@/components/animations/ViewReveal/ViewReveal';

export const Hero = () => {
    const [imgId, setImgId] = useState(0);

    const articles = [
        { src: '/hero/village.jpg', label: 'Étalans', href: 'https://maps.app.goo.gl/7KxW5F3C1jvnF3w66' },
        { src: '/hero/cave.png', label: 'Gouffre de Poudrey', href: 'https://gouffredepoudrey.com/version-anglaise/' },
        { src: '/hero/waterfall.jpg', label: 'SportsNatureÉvasion', href: 'https://www.sportsnatureevasion.com/' },
        { src: '/hero/frutiere.png', label: 'Fruitière of Étalans', href: 'https://www.comte-etalans.com/' },
    ];
    const articlesCount = articles.length;

    useEffect(() => {
        const interval = setInterval(() => {
            setImgId((prevId) => (prevId + 1) % articlesCount);
        }, 5000);

        return () => clearInterval(interval);
    }, [imgId, articlesCount]);

    return (
        <ViewReveal
            as="section"
            animationType="disclosure"
            className='overflow-hidden'
        >
            <motion.div
                viewport={{
                    once: true,
                }}
                initial={{ 
                    filter: "blur(10px)",
                }}
                animate={{ 
                    filter: "blur(0px)",
                }}
                transition={{ duration: 1.2 }}
                className={s.body}
                style={{
                    backgroundImage: `url('${PathService.withBasePath(articles[imgId].src)}')`,
                }}
            >
                <TitleBar 
                    count={articlesCount} 
                    article={articles[imgId]} 
                    imgId={imgId} 
                />
            </motion.div>
        </ViewReveal>
    )
}