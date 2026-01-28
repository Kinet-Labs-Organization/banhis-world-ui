import { useEffect, useState } from "react";
import { FaHome, FaTshirt, FaBaby, FaUtensils, FaTimes } from 'react-icons/fa';
import meta from '../data/meta.json';

function Home() {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showAd, setShowAd] = useState(false);
    const dataFetchingMode = 'local'; // 'google-sheet-app-script' | 'supa-base' | 'local'

    const getMetaDataFromGoogleSheetAppScript = async () => {
        try {
            setLoading(true);
            const URL = 'https://script.google.com/macros/s/AKfycbyoUqPuhmbrgDhv5Z52iZSRRLc-5EOhnewDbymFO8jVH8eXg9YTIBqy6va6dPn5_J0r/exec';
            const response = await fetch(URL);
            const responseData = await response.json();
            setData(responseData);
            setShowAd((responseData.ad && responseData.ad.status === 'active') || false);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching metadata:', error);
            setLoading(false);
        }
    }

    const getMetaDataFromSupaBase = async () => {
        try {
            setLoading(true);
            const URL = 'https://nitvlsqmngslgmjsyjla.supabase.co/functions/v1/metadata';
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer sb_publishable_6wT8JZCDjGvmPxBWSp69Aw_U0lCJgMs',
                    'apikey': 'sb_publishable_6wT8JZCDjGvmPxBWSp69Aw_U0lCJgMs',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "name": "Functions" })
            });
            const responseData = await response.json();
            setData(responseData);
            setShowAd((responseData.ad && responseData.ad.status === 'active') || false);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching metadata:', error);
            setLoading(false);
        }
    }

    const getMetaDataFromLocal = async () => {
        try {
            setLoading(true);
            const responseData = meta;
            setData(responseData);
            setShowAd((responseData.ad && responseData.ad.status === 'active') || false);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching metadata:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dataFetchingMode === 'local') getMetaDataFromLocal();
        if (dataFetchingMode === 'google-sheet-app-script') getMetaDataFromGoogleSheetAppScript();
        if (dataFetchingMode === 'supa-base') getMetaDataFromSupaBase();
    }, []);

    if (loading) {
        return <div className="loader"></div>;
    }

    if (selectedCategory) {
        return <ItemList />;
    }

    function ItemList() {
        return (
            <div className="category-list"
                onClick={() => setSelectedCategory(null)}
            >
                <div
                    className="category-popup"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className="cross-icon"
                    >
                        <FaTimes />
                    </button>
                    <ul className="essentials-list" style={{ margin: 0 }}>
                        {data.categories.filter(category => category.name === selectedCategory)[0].items.filter(item => item.status === 'active').map((item, index) => (
                            <li key={index}>
                                <a href={item.link} className="link-card wishlink-btn" target="_blank">
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }

    return (
        <div className="container" style={selectedCategory === 'home' ? { overflow: 'hidden', height: '100vh' } : {}}>

            {/* Header Section Starts */}
            <h2>Banhi's World</h2>
            <div className="subtitle">Fashion, Beauty, Food & Lifestyle</div>
            {/* Header Section Ends */}

            {/* Connect Section Starts */}
            <div className="section-title">Connect with me</div>
            <div className="social-grid">
                {data.handles.map((handle, index) => (
                    <a key={index} href={handle.link} className="link-card" target="_blank">
                        <img src={handle.image} alt={handle.name} />
                        {handle.name}
                    </a>
                ))}
                {data.affiliates.map((affiliate, index) => (
                    <a key={index} href={affiliate.link} className="link-card new-wishlink-btn" style={{ marginTop: "2rem" }} target="_blank">
                        ✨ Visit {affiliate.name}
                    </a>
                ))}
            </div>
            {/* Connect Section Ends */}

            {/* Recent Section Starts */}
            <div className="section-title" style={{ marginTop: "3rem" }}>Top {data.recents.filter(item => item.status === 'active').length} Essentials</div>
            <ul className="essentials-list">
                {data.recents.filter(item => item.status === 'active').reverse().map((item, index) => (
                    <li key={index}>
                        <a href={item.link} className="link-card wishlink-btn" target="_blank">
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
            {/* Recent Section Ends */}

            {/* Category Section Starts */}
            <div className="section-title" style={{ marginTop: "2rem" }}>Shop by Category</div>
            <div className="social-grid">
                <div className="link-card" style={{ height: '100px', cursor: 'pointer' }} onClick={() => setSelectedCategory('home')}>
                    <div className="category-title">
                        <div><FaHome size={20} /></div>
                        <div><span>Home Essentials</span></div>
                    </div>
                </div>

                <div className="link-card" style={{ height: '100px' }} onClick={() => setSelectedCategory('fashion')}>
                    <div className="category-title">
                        <div><FaTshirt size={20} /></div>
                        <div><span>Fashion & Beauty</span></div>
                    </div>
                </div>

                <div className="link-card" style={{ height: '100px' }} onClick={() => setSelectedCategory('baby')}>
                    <div className="category-title">
                        <div><FaBaby size={20} /></div>
                        <div><span>Baby</span></div>
                    </div>
                </div>

                <div className="link-card" style={{ height: '100px' }} onClick={() => setSelectedCategory('food')}>
                    <div className="category-title">
                        <div><FaUtensils size={20} /></div>
                        <div><span>Food</span></div>
                    </div>
                </div>
            </div>
            {/* Category Section Ends */}

            {/* Brand Section Starts */}
            <div className="section-title" style={{ marginTop: "3rem" }}>Shop my favorites</div>
            <div className="brand-grid">
                {data.brands.map((brand, index) => (
                    <a key={index} href={brand.link} className="brand-item" target="_blank">
                        <img src={brand.image} alt={brand.name} />
                        <span>{brand.name}</span>
                    </a>
                ))}
            </div>
            {/* Brand Section Ends */}

            {/* Ad Popup */}
            {showAd && (
                <div className="category-list" onClick={() => setShowAd(false)}>
                    <div className="category-popup" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowAd(false)}
                            className="cross-icon"
                        >
                            <FaTimes />
                        </button>
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            <h3 style={{ marginBottom: '15px', color: '#8e5d67' }}>{data.ad.title}</h3>
                            <p style={{ fontSize: '16px', marginBottom: '15px', color: '#666' }}>{data.ad.description}</p>
                            <a href={data.ad.link} className="link-card wishlink-btn" style={{ display: 'inline-block', marginTop: '10px' }} target="_balnk">
                                {data.ad.buttonLabel}
                            </a>
                        </div>
                    </div>
                </div>
            )}
            {/* Ad Popup Ends */}

        </div>
    );
}

export default Home;
