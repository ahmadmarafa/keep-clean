let isClean = () => {
    return /\.org|\.edu|\.gov|(edx|saylor|Coursera|UoPeople|khanacademy|academicearth|wikipedia|rwaq|wiki[a-z]{3,7}|wikimedia)\.org|(Udemy|Skillfeed|imdb|google|facebook|apple|amazon|ebay|baidu|bbc|cnn|dw|alibaba|microsoft|msn|firefox|opera|Lynda|codeschool|Codeacademy|Treehouse|paypal|w3schools?|Laracast|FreeCodeCamp|tutsplus|jumia|souq|google|tutsplus|themeforest|codecanyon|videohive|audiojungle|graphicriver|photodune|3docean|activeden|envato|linkedin|whatsapp|medium|github|gitlab|rottentomatoes|upwork|fiver|bitbucket|coinmarketcap)\.com|(tsawq|researchgate)\.net|(ghost)\.io/.test(new URL(location.href).hostname.toLowerCase());
}

let isYoutubeRestricted = () => {
    return /\"text\":\"Age-restricted video(.*[^\"])\"/.test(document.body.innerHTML);
}

let isNsfw = () => {
    // check for rating meta data
    const ratings = document.querySelectorAll("meta[name='rating']");
    ratings.forEach(meta => {
        const value = meta.getAttribute("content")?.trim().toLowerCase();
        if (value) {
            if (["adult", "mature", "rta-5042-1996-1400-1577-rta", "18+", "restricted", "20 years", "21 years"].some(r => value.includes(r))) {
                return true;
            }
        }
    });

    //check for tld porn tld ;
    if (/\.(?:porn|xxx|adult|sex|sexy|hot|cam|cams|escort|dating|love|nude|erotica?|fetish)$/i.test(new URL(location.href).hostname.toLowerCase())) {
        console.log("1")
        return true;
    }

    if (/\b(?:18\s*U\.?S\.?C\.?\s*§?\s*2257(?:[a-z])?|usc\s*2257)\b/i.test(document.body.innerHTML)) {
        return true;
    }

    //check for porn warning sign
    if (/\b(you)?(?:must|should|have)\s+(18\s*\+?|21|adult|eigteen)|only\s+for\s+adults|for\s+adults\s+only|restricted\s+to\s+adults\b/i.test(document.body.innerHTML)) {
        
        
        return true;
    }

    // is it one of the famouse porn websites
    if (/xvideos|theporndude|screwbox|pornhub|tube8|youporn|xnxx|redtube|watch\s*my\s*gf|drtuber|keezmovies|pornhd|spankwire|xxxbunker|mofosex|spankbang|topfreepornvideos|pornrox|xbabe|pornhost|thenewporn|porndreamer|updatetube|befuck|wankoz|sexvid|slutload|proporn|myxvids|bravotube|tnaflixfree|pornicom|wetplace|pornid|fapdu|dansmovies|hdmovz|pornwatchers|metaporn|fuckuh|88fuck|prevclips|bestfreepornmovies|freudbox|pornheed|longporn|eroxia|x18|fakeporn|pornrabbit|hdporn|fux|madthumbs|h2porn|porn-wanted|yourlustmovies|deviantclip|beeg|eporner|sunporno|pornerbros|nuvid|elephanttube|apetube|tubegalore|voyeurboss|xxvids|largeporntube|freetoptube|89\.com|alotporn|porncor|tjoob|extremetube|porntitan|pornomovies|vid2c|submityourflicks|empflix|xxxymovies|ah-me|xxxdessert|hell\s*porno|pervsonpatrol|vpornvideos|freeporn|mrbabes|loverofporn|pinkworld|eroticcandy|trolltube|sex\.com|porn\.com|vidz|tryboobs|jizzbunker|porn300|sleazyneasy|vivud|sexix|xbaboon|xhamster|hqcollect|\s*jav\s*(?:videos?)|woodmancastingx|wakeupnfuck|chaturbate|roccosiffredi|asianstreetmeat|streetmeatasia|brazzers|mofos|digitalplayground|babes|blacked|czechav|realitygang|erito|wicked|realitykings|fakehub|iknowthatgirl|publicpickups|caribbeancom|heyzo|10musume|1pondo|caribbeanccmpr|tokyo\s*hot|fc2|加勒比|Heydouga|kin8tengoku|brasileirinhas/i.test(new URL(location.href).hostname)) {
        return true;
    }

    

    if (/youtube.com/.test(location.href) && isYoutubeRestricted()) {
        console.log("5")

        return true;
    }


    return false;
}