export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    message?: string;
    status: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
}
