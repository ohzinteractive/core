export interface ViewSummary {
    name: string;
    url: string;
    current: boolean;
}
export interface ViewManagerLike {
    views: Array<{
        name?: unknown;
        url?: unknown;
    }>;
    get_current_view(): {
        name?: unknown;
    } | undefined;
    go_to_view(name: string, change_url?: boolean, skip?: boolean): void;
}
export interface NavigateRequest {
    name?: unknown;
    change_url?: unknown;
    skip?: unknown;
}
export interface NavigateResult {
    requested: string;
    current: string | null;
    change_url: boolean;
    skip: boolean;
}
declare class ViewNavigator {
    list(manager: ViewManagerLike): {
        current: string | null;
        views: ViewSummary[];
    };
    go(manager: ViewManagerLike, request: NavigateRequest): NavigateResult;
    private names;
    private current;
    private error;
}
export { ViewNavigator };
