interface AvatarSource {
  firstName?: string | null;
  lastName?: string | null;
  profilePicture?: string | null;
}

interface ResolveAvatarOptions {
  author?: AvatarSource | null;
  isAnonymous?: boolean;
  anonymousProfilePicture?: string | null;
}

const initialsAvatar = (name: string, background: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${background}&color=fff&size=106`;

/**
 * Picks the avatar to display for a post/comment/wave author.
 * Anonymous content never exposes the real author's picture, even when the API
 * includes the author for admins.
 */
export const resolveAvatarUrl = ({
  author,
  isAnonymous = false,
  anonymousProfilePicture,
}: ResolveAvatarOptions): string => {
  if (isAnonymous) {
    return anonymousProfilePicture || initialsAvatar("A", "cacaca");
  }
  if (author?.profilePicture) return author.profilePicture;
  const name = `${author?.firstName || "A"} ${author?.lastName || "U"}`;
  return initialsAvatar(name, "random");
};
