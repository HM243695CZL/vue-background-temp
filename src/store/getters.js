const getters = {
    sidebar: state => state.app.sidebar,
    language: state => state.app.language,
    device: state => state.app.device,
    size: state => state.app.size,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    introduction: state => state.user.introduction,
    roles: state => state.user.roles,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    permission_routes: state => state.permission.routes
};
export default getters;