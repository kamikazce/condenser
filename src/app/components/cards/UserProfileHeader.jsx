/* eslint react/prop-types: 0 */
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Icon from 'app/components/elements/Icon';
import Follow from 'app/components/elements/Follow';
import Tooltip from 'app/components/elements/Tooltip';
import DateJoinWrapper from 'app/components/elements/DateJoinWrapper';
import tt from 'counterpart';
import Userpic from 'app/components/elements/Userpic';
import AffiliationMap from 'app/utils/AffiliationMap';
import { proxifyImageUrl } from 'app/utils/ProxifyUrl';
import SanitizedLink from 'app/components/elements/SanitizedLink';
import { numberWithCommas } from 'app/utils/StateFunctions';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import DropdownMenu from 'app/components/elements/DropdownMenu';

class UserProfileHeader extends React.Component {
    render() {
        const { current_user, accountname, profile, badges } = this.props;
        const badgesTypes = {
            activity: [],
            perso: [],
            meetup: [],
            challenge: [],
            badges: [],
        };
        const hivebuzzBadges = _.get(badges, 'hivebuzz', []);
        const peakdBadges = _.get(badges, 'peakd', []);
        if (hivebuzzBadges) {
            hivebuzzBadges.forEach(badge => {
                const type = badge.get('type');
                badgesTypes[type].push(
                    <a
                        className="UserProfile__badge_image"
                        key={badge.get('id')}
                        href={`https://hivebuzz.me/@${accountname}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={badge.get('url')}
                            alt={badge.get('title')}
                            title={badge.get('title')}
                        />
                    </a>
                );
            });
        }
        if (peakdBadges) {
            peakdBadges.forEach(badge => {
                const type = badge.get('type');
                badgesTypes[type].push(
                    <a
                        className="UserProfile__badge_image"
                        key={badge.get('id')}
                        href={`https://peakd.com/b/${badge.get('name')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={badge.get('url')}
                            alt={badge.get('title')}
                            title={badge.get('title')}
                            className="UserProfile__badge_image"
                        />
                    </a>
                );
            });
        }
        const isMyAccount = current_user === accountname;

        const { name, location, about, website, cover_image } = profile
            ? profile.getIn(['metadata', 'profile']).toJS()
            : {};
        const website_label = website
            ? website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
            : null;

        let cover_image_style = {};
        if (cover_image) {
            cover_image_style = {
                backgroundImage:
                    'url(' + proxifyImageUrl(cover_image, '2048x512') + ')',
            };
        }

        const _lists = profile.get('blacklists').toJS();
        const blacklists = _lists.length > 0 && (
            <DropdownMenu
                title="Blacklisted on:"
                className="UserProfile__blacklists"
                items={_lists.map(list => {
                    return { value: list };
                })}
                el="div"
            >
                <span className="account_warn">({_lists.length})</span>
            </DropdownMenu>
        );

        return (
            <div className="UserProfile__banner row expanded">
                <div className="column" style={cover_image_style}>
                    <div style={{ position: 'relative' }}>
                        <div className="UserProfile__buttons hide-for-small-only">
                            <Follow
                                follower={current_user}
                                following={accountname}
                            />
                        </div>
                    </div>
                    <h1>
                        <div className="UserProfile__Userpic">
                            <Userpic account={accountname} hideIfDefault />
                        </div>
                        {name || accountname}{' '}
                        <Tooltip
                            t={tt(
                                'user_profile.this_is_users_reputations_score_it_is_based_on_history_of_votes',
                                { name: accountname }
                            )}
                        >
                            <span className="UserProfile__rep">
                                ({Math.floor(profile.get('reputation'))})
                            </span>
                        </Tooltip>
                        <Tooltip
                            t={tt('user_profile.hivebuzz_level_badge', {
                                name: accountname,
                            })}
                        >
                            <a
                                href={`http://hivebuzz.me/@${accountname}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={`https://hivebuzz.me/@${
                                        accountname
                                    }/level.png`}
                                    alt="Hivebuzz level badge"
                                    className="UserProfile__badge_image_hivebuzzlevel"
                                />
                            </a>
                        </Tooltip>
                        {blacklists}
                        {AffiliationMap[accountname] ? (
                            <span className="affiliation">
                                {tt(
                                    'g.affiliation_' +
                                        AffiliationMap[accountname]
                                )}
                            </span>
                        ) : null}
                    </h1>

                    <div>
                        {about && <p className="UserProfile__bio">{about}</p>}
                        <div className="UserProfile__stats">
                            <span>
                                <Link to={`/@${accountname}/followers`}>
                                    {tt('user_profile.follower_count', {
                                        count: profile.getIn(
                                            ['stats', 'followers'],
                                            0
                                        ),
                                    })}
                                </Link>
                            </span>
                            <span>
                                <Link to={`/@${accountname}`}>
                                    {tt('user_profile.post_count', {
                                        count: profile.get('post_count', 0),
                                    })}
                                </Link>
                            </span>
                            <span>
                                <Link to={`/@${accountname}/followed`}>
                                    {tt('user_profile.followed_count', {
                                        count: profile.getIn(
                                            ['stats', 'following'],
                                            0
                                        ),
                                    })}
                                </Link>
                            </span>
                            <span>
                                {numberWithCommas(
                                    profile.getIn(['stats', 'sp'], 0)
                                )}{' '}
                                HP
                            </span>
                            {profile.getIn(['stats', 'rank'], 0) > 0 && (
                                <span>
                                    #{numberWithCommas(
                                        profile.getIn(['stats', 'rank'])
                                    )}
                                </span>
                            )}
                        </div>

                        <p className="UserProfile__info">
                            {location && (
                                <span>
                                    <Icon name="location" /> {location}
                                </span>
                            )}
                            {website && (
                                <span>
                                    <Icon name="link" />{' '}
                                    <SanitizedLink
                                        url={website}
                                        text={website_label}
                                    />
                                </span>
                            )}
                            <Icon name="calendar" />{' '}
                            <DateJoinWrapper date={profile.get('created')} />
                            <Icon name="calendar" /> Active{' '}
                            <TimeAgoWrapper date={profile.get('active')} />
                        </p>
                        {(hivebuzzBadges.size > 0 || peakdBadges.size > 0) && (
                            <div className="UserProfile__badges row">
                                <div className="UserProfile__badges_tabs_container">
                                    <Tabs>
                                        <TabList>
                                            {badgesTypes.badges.length > 0 && (
                                                <Tab>Badges</Tab>
                                            )}
                                            {badgesTypes.activity.length >
                                                0 && <Tab>Activity</Tab>}
                                            {badgesTypes.perso.length > 0 && (
                                                <Tab>Personal</Tab>
                                            )}
                                            {badgesTypes.meetup.length > 0 && (
                                                <Tab>Meetups</Tab>
                                            )}
                                            {badgesTypes.challenge.length >
                                                0 && <Tab>Challenges</Tab>}
                                        </TabList>
                                        {badgesTypes.badges.length > 0 && (
                                            <TabPanel>
                                                {badgesTypes.badges}
                                            </TabPanel>
                                        )}
                                        {badgesTypes.activity.length > 0 && (
                                            <TabPanel>
                                                {badgesTypes.activity}
                                            </TabPanel>
                                        )}
                                        {badgesTypes.perso.length > 0 && (
                                            <TabPanel>
                                                {badgesTypes.perso}
                                            </TabPanel>
                                        )}
                                        {badgesTypes.meetup.length > 0 && (
                                            <TabPanel>
                                                {badgesTypes.meetup}
                                            </TabPanel>
                                        )}
                                        {badgesTypes.challenge.length > 0 && (
                                            <TabPanel>
                                                {badgesTypes.challenge}
                                            </TabPanel>
                                        )}
                                    </Tabs>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="UserProfile__buttons_mobile show-for-small-only">
                        <Follow
                            follower={current_user}
                            following={accountname}
                            what="blog"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect((state, props) => {
    return {
        current_user: state.user.getIn(['current', 'username']),
        accountname: props.accountname,
        profile: props.profile,
    };
})(UserProfileHeader);