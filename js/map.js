document.addEventListener("DOMContentLoaded", function () {

    const regions = {
        "KR-42": {
            name: "강원도",
            slug: "gangwon",
            url: "/region=gangwon/"
        },

        "KR-45": {
            name: "전라북도",
            slug: "jeonbuk",
            url: "/region=jeonbuk/"
        },

        "KR-46": {
            name: "전라남도",
            slug: "jeonnam",
            url: "/region=jeonnam/"
        },

        "KR-47": {
            name: "경상북도",
            slug: "gyeongbuk",
            url: "/region=gyeongbuk/"
        },

        "KR-48": {
            name: "경상남도",
            slug: "gyeongnam",
            url: "/region=gyeongnam/"
        },

        "KR-29": {
            name: "광주광역시",
            slug: "gwangju",
            url: "/region=gwangju/"
        },

        "KR-27": {
            name: "대구광역시",
            slug: "daegu",
            url: "/region=daegu/"
        },

        "KR-31": {
            name: "울산광역시",
            slug: "ulsan",
            url: "/region=ulsan/"
        },

        "KR-26": {
            name: "부산광역시",
            slug: "busan",
            url: "/region=busan/"
        },

        "KR-30": {
            name: "대전광역시",
            slug: "daejeon",
            url: "/region=daejeon/"
        },

        "KR-43": {
            name: "충청북도",
            slug: "chungbuk",
            url: "/region=chungbuk/"
        },

        "KR-44": {
            name: "충청남도",
            slug: "chungnam",
            url: "/region=chungnam/"
        }
    };


    const map = document.getElementById("service-map");

    const label = document.createElement("div");

    const modal = document.getElementById("region-modal");
    const closeButton = document.getElementById("modal-close");

    if (closeButton) {
        closeButton.addEventListener("click", function () {
            modal.style.display = "none";
        });
    }

    label.id = "map-label";

    label.style.position = "fixed";
    label.style.display = "none";
    label.style.padding = "8px 16px";
    label.style.background = "rgba(0,0,0,0.8)";
    label.style.color = "#ffffff";
    label.style.borderRadius = "8px";
    label.style.pointerEvents = "none";
    label.style.fontSize = "22px";
    label.style.fontWeight = "700";
    label.style.whiteSpace = "nowrap";
    label.style.zIndex = "9999";

    document.body.appendChild(label);

    document.querySelectorAll("#service-map path").forEach(function (path) {

        const region = regions[path.id];

        if (!region) {

            path.style.fill = "#d9d9d9";
            path.style.opacity = "0.4";
            path.style.cursor = "default";

            return;
        }

        path.style.fill = "#f7e7a1";
        path.style.opacity = "1";
        path.style.cursor = "pointer";

        path.addEventListener("mouseenter", function () {

            path.style.fill = "#f0c040";

            label.textContent = region.name;

            label.style.display = "block";

        });

        path.addEventListener("mousemove", function (e) {

            label.style.left = (e.clientX + 12) + "px";

            label.style.top = (e.clientY - 10) + "px";

        });

        path.addEventListener("mouseleave", function () {

            path.style.fill = "#f7e7a1";

            label.style.display = "none";

        });

        path.addEventListener("click", async function () {

            const response = await fetch("/posts.json");

            const posts = await response.json();

            const regionPosts = posts
                .filter(post => post.region === region.slug)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3);

            document.getElementById("modal-title").textContent =
                region.name;

            document.getElementById("modal-more").href =
                region.url;

            document.getElementById("modal-posts").innerHTML =
                regionPosts.map(post => {
                    let thumbHtml = '';

                    // 1. BEFORE / AFTER 반반 썸네일
                    if (post.thumb_before && post.thumb_after) {
                        thumbHtml = `
                            <div style="display: flex; width: 100%; aspect-ratio: 400/289; overflow: hidden; position: relative; border-radius: 6px;">
                                <div style="width: 50%; height: 100%; position: relative; border-right: 2px solid #fff; overflow: hidden;">
                                    <img src="${post.thumb_before}" alt="시공 전" style="width: 100% !important; height: 100% !important; object-fit: cover !important;">
                                    <span style="position: absolute; bottom: 6px; left: 6px; font-size: 10px; font-weight: bold; padding: 2px 5px; border-radius: 3px; color: #fff; background-color: rgba(220, 53, 69, 0.85); z-index: 2;">BEFORE</span>
                                </div>
                                <div style="width: 50%; height: 100%; position: relative; overflow: hidden;">
                                    <img src="${post.thumb_after}" alt="시공 후" style="width: 100% !important; height: 100% !important; object-fit: cover !important;">
                                    <span style="position: absolute; bottom: 6px; right: 6px; font-size: 10px; font-weight: bold; padding: 2px 5px; border-radius: 3px; color: #fff; background-color: rgba(40, 167, 69, 0.85); z-index: 2;">AFTER</span>
                                </div>
                            </div>
                        `;
                    } else {
                        // 2. 단일 썸네일 폴백 (thumbnail, thumb_before, image 중 존재하는 경로)
                        const singleImg = post.thumbnail || post.thumb_before || post.image;
                        if (singleImg) {
                            thumbHtml = `
                                <div style="width: 100%; aspect-ratio: 400/289; overflow: hidden; border-radius: 6px;">
                                    <img src="${singleImg}" alt="${post.title}" style="width: 100% !important; height: 100% !important; object-fit: cover !important;">
                                </div>
                            `;
                        }
                    }

                    return `
                        <div class="modal-post" style="margin-bottom: 20px;">
                            <a href="${post.url}" style="text-decoration: none; color: inherit;">
                                ${thumbHtml}
                                <h4 style="margin-top: 10px; font-size: 16px; font-weight: bold;">${post.title}</h4>
                            </a>
                        </div>
                    `;
                }).join("");

            document.getElementById("region-modal").style.display =
                "block";

        });

    });

});