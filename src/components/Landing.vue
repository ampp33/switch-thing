<template>
    <div className="homepage">

        <div className="logo-homepage">
            <img src="/src/assets/logo-home-page.png" alt="Logo" />
        </div>

        <div className="hero-text">
            <h1 className="main-text">
                Everything<br>
                about switches,<br />
                all in one place.
            </h1>

            <p className="the-para">
                A fully searchable, community powered, database of mechanical keyboard switches,<br>
                making it easier to find the parts you need.
            </p>

            <router-link to='/search' class="search-button">
            Search
            </router-link>
        </div>
    </div>
</template>

<style>
.homepage {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-around;
    align-items: center;

    .logo-homepage {
        animation: anime 1s infinite ease-in-out alternate;

        img {
            width: 401px;
            height: 467px;
        }


    }

    .hero-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 30px;
        padding-left: 100px;

        .main-text {
            font-family: 'Rubik', sans-serif;
            font-size: 70px;
            background: linear-gradient(107deg, #D2DBED 2.45%, rgba(163, 135, 254, 0.63) 97.24%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;

        }

        .the-para {
            font-family: 'Rubik', sans-serif;
            color: #D2DBED;
            font-size: 18px;
        }

        .search-button {
            display: inline-block;
            padding: 6px 13px;
            text-decoration: none;
            border-radius: 20px;
            background: linear-gradient(93deg, #383252 -54.66%, #A387FE 96.5%);
            width: 127px;
            height: 37px;
            color: #FFFFFF;
            font-family: 'Rubik', sans-serif;
            font-size: 20px;
            text-align: center;
            transform: translateY(40px);

            &:hover {
                background: linear-gradient(93deg, #383252 -54.66%, #835dff 96.5%);
            }

        }

    }
}

@keyframes anime {
    0% {
        transform: translateY(12px);
    }

    100% {
        transform: translateY(25px);
    }
}
</style>