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

export interface IKeywordBulkCreateRequest {
    user_id: string;
    keywords: Keyword[];
}

interface Keyword {
    value: string;
    num_of_links?: number;
    num_of_adwords?: number;
    search_result_information?: string;
    html_code?: string;
}
