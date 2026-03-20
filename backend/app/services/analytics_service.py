from collections import Counter
from typing import List
from app.schemas import (
    Game, AnalyticsResponse, ContinentDistribution, EraDistribution,
    CountryDistribution, TimelinePoint, GenreDistribution,
)


def compute_analytics(games: List[Game]) -> AnalyticsResponse:
    total = len(games)

    # Continent distribution
    continent_counter = Counter(g.continent for g in games)
    continent_dist = [
        ContinentDistribution(
            continent=continent,
            count=count,
            percentage=round((count / total) * 100, 1) if total else 0,
        )
        for continent, count in continent_counter.most_common()
    ]

    # Era distribution
    era_counter = Counter(g.era_label for g in games)
    era_dist = [
        EraDistribution(
            era_label=era,
            count=count,
            percentage=round((count / total) * 100, 1) if total else 0,
        )
        for era, count in era_counter.most_common()
    ]

    # Country distribution — top 12
    country_counter = Counter(g.country for g in games)
    country_dist = [
        CountryDistribution(name=country, count=count)
        for country, count in country_counter.most_common(12)
    ]

    # Timeline — group by (era_label, era_start), sorted chronologically
    era_start_map: dict = {}
    for g in games:
        key = g.era_label
        if key not in era_start_map:
            era_start_map[key] = g.era_start
    era_counts = Counter(g.era_label for g in games)
    timeline = sorted(
        [
            TimelinePoint(era_label=label, era_start=era_start_map[label], count=count)
            for label, count in era_counts.items()
        ],
        key=lambda x: x.era_start,
    )

    # Genre distribution — top 10
    genres = [genre for g in games for genre in g.genres]
    genre_counter = Counter(genres)
    genre_dist = [
        GenreDistribution(genre=genre, count=count)
        for genre, count in genre_counter.most_common(10)
    ]

    # Rankings
    countries = [g.country for g in games]
    platforms = [p for g in games for p in g.platforms]
    eras = [g.era_label for g in games]

    top_country = Counter(countries).most_common(1)[0][0] if countries else "N/A"
    top_era = Counter(eras).most_common(1)[0][0] if eras else "N/A"
    top_genre = genre_dist[0].genre if genre_dist else "N/A"
    top_platform = Counter(platforms).most_common(1)[0][0] if platforms else "N/A"

    return AnalyticsResponse(
        continent_distribution=continent_dist,
        era_distribution=era_dist,
        country_distribution=country_dist,
        timeline=timeline,
        genre_distribution=genre_dist,
        top_country=top_country,
        top_era=top_era,
        top_genre=top_genre,
        top_platform=top_platform,
    )
