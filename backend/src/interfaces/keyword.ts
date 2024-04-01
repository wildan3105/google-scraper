export interface IKeyword {
    id: string;
    value: string;
    created_at: Date;
    updated_at: Date;
    num_of_links?: number;
    num_of_adwords?: number;
    search_result_information?: string;
    html_code?: string;
}

export interface IKeywordCreateRequest {
    value: string;
    user_id: string;
    num_of_links?: number;
    num_of_adwords?: number;
    search_result_information?: string;
    html_code?: string;
}
