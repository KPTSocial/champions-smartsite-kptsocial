-- Archive remaining unused tables
ALTER TABLE IF EXISTS mug_club_members RENAME TO _archived_mug_club_members;
ALTER TABLE IF EXISTS whiskey_room_members RENAME TO _archived_whiskey_room_members;
ALTER TABLE IF EXISTS vip_applications RENAME TO _archived_vip_applications;
ALTER TABLE IF EXISTS referrals RENAME TO _archived_referrals;
ALTER TABLE IF EXISTS user_profiles RENAME TO _archived_user_profiles;
ALTER TABLE IF EXISTS social_posts RENAME TO _archived_social_posts;
ALTER TABLE IF EXISTS photo_booth_posts RENAME TO _archived_photo_booth_posts;