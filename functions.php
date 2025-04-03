<?php
/**
 * ARTWORKS HEADLESS
 *
 * 
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;




add_filter( 'acf/settings/rest_api_format', function () {
    return 'standard';
} );




/**
 * Generate a small blur data URL for image placeholders
 * 
 * @param int $attachment_id The image attachment ID
 * @param string $size The image size to use
 * @return string Base64 encoded image data URL
 */
function generate_blur_data_url_small($attachment_id, $size = 'thumbnail') {
    // Get image source
    $image = wp_get_attachment_image_src($attachment_id, $size);
    
    if (!$image) {
        return '';
    }
    
    // Get the image path from URL
    $image_url = $image[0];
    $upload_dir = wp_upload_dir();
    $image_path = str_replace($upload_dir['baseurl'], $upload_dir['basedir'], $image_url);
    
    // Check if file exists
    if (!file_exists($image_path)) {
        return '';
    }
    
    // Create a tiny version for the blur effect
    $width = 10; // Very small width
    $mime_type = get_post_mime_type($attachment_id);
    
    // Load image based on mime type
    switch ($mime_type) {
        case 'image/jpeg':
            $src_img = imagecreatefromjpeg($image_path);
            break;
        case 'image/png':
            $src_img = imagecreatefrompng($image_path);
            break;
        case 'image/gif':
            $src_img = imagecreatefromgif($image_path);
            break;
        default:
            return '';
    }
    
    if (!$src_img) {
        return '';
    }
    
    // Get original dimensions
    $orig_width = imagesx($src_img);
    $orig_height = imagesy($src_img);
    
    // Calculate new height while maintaining aspect ratio
    $height = floor($orig_height * ($width / $orig_width));
    
    // Create new image
    $new_img = imagecreatetruecolor($width, $height);
    
    // Handle transparency for PNG
    if ($mime_type === 'image/png') {
        imagealphablending($new_img, false);
        imagesavealpha($new_img, true);
        $transparent = imagecolorallocatealpha($new_img, 255, 255, 255, 127);
        imagefilledrectangle($new_img, 0, 0, $width, $height, $transparent);
    }
    
    // Resize the image
    imagecopyresampled($new_img, $src_img, 0, 0, 0, 0, $width, $height, $orig_width, $orig_height);
    
    // Start output buffering
    ob_start();
    
    // Output image to buffer
    switch ($mime_type) {
        case 'image/jpeg':
            imagejpeg($new_img, null, 50);
            break;
        case 'image/png':
            imagepng($new_img, null, 7);
            break;
        case 'image/gif':
            imagegif($new_img);
            break;
    }
    
    // Get image data from buffer
    $image_data = ob_get_clean();
    
    // Free memory
    imagedestroy($src_img);
    imagedestroy($new_img);
    
    // Return base64 encoded data URL
    return 'data:' . $mime_type . ';base64,' . base64_encode($image_data);
}

// Generate on media upload
add_action('add_attachment', function($attachment_id) {
    if (strpos(get_post_mime_type($attachment_id), 'image') !== false) {
        generate_blur_data_url_small($attachment_id);
    }
});

//--------------------------------------------------
// REST API Enhancements
//--------------------------------------------------

// Register core media field
add_action('rest_api_init', function() {
    register_rest_field('attachment', 'base64', [
        'get_callback' => fn($obj) => generate_blur_data_url_small($obj['id']),
        'schema' => null
    ]);
});

// Modified ACF Gallery Filter
add_filter('acf/format_value/type=gallery', function($value, $post_id, $field) {
    if (is_array($value)) {
      foreach ($value as &$image) {
        if (!empty($image['ID'])) {
          // Use lowercase 'id' if needed (ACF sometimes varies)
          $attachment_id = $image['ID'] ?? $image['id'] ?? 0;
          if ($attachment_id) {
            $image['base64'] = generate_blur_data_url_small($attachment_id);
          }
        }
      }
    }
    return $value;
  }, 20, 3); // Higher priority to override other filters

/**
 * Register the /wp-json/wp/v2/projectos_cache endpoint so it will be cached.
 */
function wprc_add_acf_posts_endpoint( $allowed_endpoints ) {
    if ( ! isset( $allowed_endpoints[ 'wp/v2' ] ) || ! in_array( 'projectos_cache', $allowed_endpoints[ 'wp/v2' ] ) ) {
        $allowed_endpoints[ 'wp/v2' ][] = 'projectos_cache';
    }
    if ( ! isset( $allowed_endpoints[ 'wp/v2' ] ) || ! in_array( 'home_cache', $allowed_endpoints[ 'wp/v2' ] ) ) {
        $allowed_endpoints[ 'wp/v2' ][] = 'home_cache';
    }
    return $allowed_endpoints;
}
add_filter( 'wp_rest_cache/allowed_endpoints', 'wprc_add_acf_posts_endpoint', 10, 1);




function get_homepage_content($request) {
    $locale = $request->get_param('locale'); // Get locale from request
    $slug = "home-" . $locale; // Construct slug

    $args = [
        'post_type'      => 'page',
        'posts_per_page' => 1,
        'name'           => $slug,
        'lang'           => $locale, // WPML support
        'fields'         => 'ids',
    ];

    $query = new WP_Query($args);

    if (!$query->have_posts()) {
        return new WP_Error('no_homepage', __('Homepage not found'), ['status' => 404]);
    }

    $post_id = $query->posts[0];

    // Fetch ACF fields
    $acf_data = get_fields($post_id);

    $project_ids = $acf_data['project1']['items'] ?? [];
    $project_ids0 = $acf_data['project1']['items0'] ?? [];
    $project_thumbnail = $acf_data['project1']['thumbnails'] ?? [];

    $all_project_ids = array_merge($project_ids, $project_ids0);
    error_log("Project IDs: " . print_r($all_project_ids, true));

    $projects = [];

    if (!empty($all_project_ids)) {
        foreach ($all_project_ids as $index => $project_id) {
            $project = get_post($project_id);
            
            if ($project) {
                error_log("Fetching project ID: " . $project_id);

                if ($project->post_type !== 'projectos') {
                    error_log("Skipping ID: $project_id (Wrong post type: " . $project->post_type . ")");
                    continue;
                }

                // Assign a thumbnail to each project
                $thumbnail_index = $index % count($project_thumbnail);
                $thumbnail_url = $project_thumbnail[$thumbnail_index];

                $projects[$project_id] = [
                    'id'        => $project->ID,
                    'title'     => $project->post_title,
                    'content'   => apply_filters('the_content', $project->post_content),
                    'excerpt'   => get_the_excerpt($project->ID),
                    'thumbnail' => $thumbnail_url, // Assign the thumbnail URL
                    'acf'       => [
                        'page_title' => get_field('page_title', $project->ID), // Fetch specific ACF field
                        'year'       => get_field('year', $project->ID), // Fetch specific ACF field
                    ],
                ];
            } else {
                error_log("Project ID $project_id not found.");
            }
        }
    } else {
        error_log("No valid project IDs found.");
    }

    error_log("Projects fetched: " . print_r($projects, true));

    $acf_data['project1']['items'] = array_values(array_filter(array_map(fn($id) => $projects[$id] ?? null, $project_ids)));
    $acf_data['project1']['items0'] = array_values(array_filter(array_map(fn($id) => $projects[$id] ?? null, $project_ids0)));

    // Organize the acf_data elements
    $organized_acf_data = [
        'home_splash' => $acf_data['home_splash'] ?? [],
        'about0' => $acf_data['about0'] ?? [],
        'about1' => $acf_data['about1'] ?? [],
        'production0' => $acf_data['production0'] ?? [],
        'production1' => $acf_data['production1'] ?? [],
        'project0' => $acf_data['project0'],
        'project1' => [
            'items'      => $acf_data['project1']['items'] ?? [],
            'items0'     => $acf_data['project1']['items0'] ?? [],
            'link'       => $acf_data['project1']['link'] ?? [],
            'thumbnails' => $acf_data['project1']['thumbnails'] ?? [],
        ],
        'residency0' => $acf_data['residency0'] ?? [],
    ];

    $response = [
        'id'    => $post_id,
        'title' => get_the_title($post_id),
        'slug'  => $slug,
        'acf'   => $organized_acf_data,
    ];

    return rest_ensure_response([$response]);
}



function get_projectos(WP_REST_Request $request) {
    $lang = $request->get_param('lang');
    $page = $request->get_param('page') ? intval($request->get_param('page')) : 1;
    $per_page = $request->get_param('per_page') ? intval($request->get_param('per_page')) : 10;

    if ($lang) {
        do_action('wpml_switch_language', $lang);
    }

    $args = array(
        'post_type'      => 'projectos',
        'posts_per_page' => $per_page,
        'paged'          => $page,
    );

    $query = new WP_Query($args);
    $projects = [];

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            
            $featured_image_id = get_post_thumbnail_id();
            $featured_image = wp_get_attachment_image_src($featured_image_id, 'full');

            if ($featured_image) {
                $featured_image_url = $featured_image[0];
                $featured_image_width = $featured_image[1];
                $featured_image_height = $featured_image[2];
				$blurDataURL = generate_blur_data_url_small($featured_image_id, 'thumbnail');
            } else {
                $featured_image_url = '';
                $featured_image_width = 0;
                $featured_image_height = 0;
				$blurDataURL = '';
            }

            $artistas = wp_get_post_terms(get_the_ID(), 'artistas', array('fields' => 'ids'));
            $materiais = wp_get_post_terms(get_the_ID(), 'materiais', array('fields' => 'ids'));

            $projects[] = array(
                'id' => get_the_ID(),
                'title' => array('rendered' => html_entity_decode(get_the_title(), ENT_QUOTES, 'UTF-8')),
                'slug' => get_post_field('post_name', get_the_ID()),
                'content' => get_the_content(),
                'featured_media' => $featured_image_id,
                'featured_image' => array(
                    'url' => $featured_image_url,
                    'width' => $featured_image_width,
                    'height' => $featured_image_height,
					'blurDataURL' => $blurDataURL, 
                ),
                'acf' => array(
                    'page_title' => get_field('page_title'),
                    'year' => get_field('year'),
                    'location' => get_field('location'),
                    'right_field' => get_field('right_field'),
                ),
                'artistas' => $artistas,
                'materiais' => $materiais,
                'modified' => get_the_modified_time('c'),
            );
        }
    }

    wp_reset_postdata();

    return rest_ensure_response([
        'projects' => $projects,
        'total' => (int) $query->found_posts,
        'total_pages' => (int) $query->max_num_pages,
    ]);
}

function search_projectos(WP_REST_Request $request) {
    $lang = $request->get_param('lang');
    $search = $request->get_param('search');

    if ($lang) {
        do_action('wpml_switch_language', $lang); // Switch WPML language
    }

    $args = array(
        'post_type'      => 'projectos',
        'posts_per_page' => -1,
        'meta_query'     => array(
            'relation' => 'OR', // Search in multiple ACF fields
            array(
                'key'     => 'page_title', // ACF field name
                'value'   => $search,
                'compare' => 'LIKE'
            ),
            array(
                'key'     => 'year',
                'value'   => $search,
                'compare' => 'LIKE'
            ),
            array(
                'key'     => 'location',
                'value'   => $search,
                'compare' => 'LIKE'
            ),
            array(
                'key'     => 'right_field',
                'value'   => $search,
                'compare' => 'LIKE'
            ),
        ),
    );

    $query = new WP_Query($args);
    $projects = [];
            
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $featured_image_id = get_post_thumbnail_id();
            $featured_image = wp_get_attachment_image_src($featured_image_id, 'full');
            
            // Check if the image exists and get its URL, width, and height
            if ($featured_image) {
                $featured_image_url = $featured_image[0]; // URL
                $featured_image_width = $featured_image[1]; // Width
                $featured_image_height = $featured_image[2]; // Height
				$blurDataURL = generate_blur_data_url_small($featured_image_id, 'thumbnail');
            } else {
                $featured_image_url = '';
                $featured_image_width = 0;
                $featured_image_height = 0;
				$blurDataURL = '';
            }
            $projects[] = array(
                'id' => get_the_ID(),
                'title' => array('rendered' => get_the_title()),
                'slug' => get_post_field('post_name', get_the_ID()),
                'content' => get_the_content(),
                'featured_image' => array(
                    'url' => $featured_image_url, // URL of the featured image
                    'width' => $featured_image_width, // Width of the image
                    'height' => $featured_image_height, // Height of the image
					'blurDataURL' => $blurDataURL, 
                ),
                'acf' => array(
                    'page_title' => get_field('page_title'),
                    'year' => get_field('year'),
                    'location' => get_field('location'),
                    'right_field' => get_field('right_field'),
                ),
                'modified' => get_the_modified_time('c'),
            );
        }
    }

    wp_reset_postdata();

    return rest_ensure_response($projects);
}




/**
 * Get a project by its slug
 */
function get_project_by_slug(WP_REST_Request $request) {
    $slug = $request->get_param('slug');
    $lang = $request->get_param('lang');

    if ($lang) {
        do_action('wpml_switch_language', $lang);
    }

    $args = array(
        'post_type' => 'projectos',
        'posts_per_page' => 1,
        'name' => $slug,
    );

    $query = new WP_Query($args);

    if (!$query->have_posts()) {
        return new WP_Error('no_project', __('Project not found'), ['status' => 404]);
    }

    $project = $query->posts[0];

    $featured_image_id = get_post_thumbnail_id($project->ID);
    $featured_image = wp_get_attachment_image_src($featured_image_id, 'full');

    if ($featured_image) {
        $featured_image_url = $featured_image[0];
        $featured_image_width = $featured_image[1];
        $featured_image_height = $featured_image[2];
        $blurDataURL = generate_blur_data_url_small($featured_image_id, 'thumbnail');
    } else {
        $featured_image_url = '';
        $featured_image_width = 0;
        $featured_image_height = 0;
        $blurDataURL = '';
    }

    // Fetch gallery field
    $gallery = get_field('galeria', $project->ID);

    $project_data = array(
        'id' => $project->ID,
        'title' => array('rendered' => html_entity_decode($project->post_title, ENT_QUOTES, 'UTF-8')),
        'slug' => $project->post_name,
        'content' => $project->post_content,
        'featured_media' => $featured_image_id,
        'featured_image' => array(
            'url' => $featured_image_url,
            'width' => $featured_image_width,
            'height' => $featured_image_height,
            'blurDataURL' => $blurDataURL,
        ),
        'acf' => array(
            'page_title' => get_field('page_title', $project->ID),
            'year' => get_field('year', $project->ID),
            'location' => get_field('location', $project->ID),
            'right_field' => get_field('right_field', $project->ID),
            'galeria' => $gallery, // Include gallery field
        ),
    );

    if ($gallery) {
        $project_data['acf']['galeria'] = array_map(function ($image) {
            $attachment = wp_get_attachment_metadata($image['ID']);
            $image_url = $image['url'];
            $image_name = $image['filename'];
            $image_slug = $image['name'];
            $image_id = $image['ID'];
            $image_width = $image['width'];
            $image_height = $image['height'];
            $image_sizes = $image['sizes'];
            $base64 = $image['base64'];

            return [
                'url' => $image_url,
                'name' => $image_name,
                'slug' => $image_slug,
                'id' => $image_id,
                'width' => $image_width,
                'height' => $image_height,
                'sizes' => $image_sizes,
                'base64' => $base64,
            ];
        }, $gallery);
    }

    return rest_ensure_response($project_data);
}



add_action('rest_api_init', function () {
    // Register the cached project list endpoint
    register_rest_route('wp/v2', '/projectos_cache', array(
        'methods' => 'GET',
        'callback' => 'get_projectos',
        'args' => array(
            'lang' => array(
                'required' => false,
                'validate_callback' => function ($param) {
                    return in_array($param, ['pt', 'en']);
                }
            ),
            'page' => array(
                'required' => false,
                'validate_callback' => function ($param) {
                    return is_numeric($param) && $param > 0;
                }
            ),
            'per_page' => array(
                'required' => false,
                'validate_callback' => function ($param) {
                    return is_numeric($param) && $param > 0;
                }
            )
        )
    ));
 // Register the cached project list endpoint
 register_rest_route('wp/v2', '/projectos_cache/(?P<slug>[a-zA-Z0-9-]+)', array(
    'methods' => 'GET',
    'callback' => 'get_project_by_slug',
    'args' => array(
        'slug' => array(
            'required' => true,
        ),
    ),
    ));
    // Register the search-specific endpoint
    register_rest_route('wp/v2', '/projectos_search', array(
        'methods' => 'GET',
        'callback' => 'search_projectos',
        'args' => array(
            'lang' => array(
                'required' => false,
                'validate_callback' => function ($param, $request, $key) {
                    return in_array($param, ['pt', 'en']);
                }
            ),
            'search' => array(
                'required' => true,
                'sanitize_callback' => 'sanitize_text_field',
            )
        )
    ));

    register_rest_route('wp/v2', '/home_cache', [
        'methods'  => 'GET',
        'callback' => 'get_homepage_content',
        'args'     => [
            'locale' => [
                'required' => true,
                'validate_callback' => function($param) {
                    return is_string($param);
                }
            ]
        ],
        'permission_callback' => '__return_true',
    ]);
});









function flush_projectos_cache() {
    if (class_exists('\WP_REST_Cache_Plugin\Includes\Caching\Caching')) {
        $cache_instance = \WP_REST_Cache_Plugin\Includes\Caching\Caching::get_instance();

        // Define all endpoints to be flushed
        $endpoints = [
            '/wp-json/wp/v2/projectos_cache',
            '/wp-json/wp/v2/home_cache',
            '/wp-json/wp/v2/pages',
            '/wp-json/wp/v2/projectos_search',
            '/wp-json/wp/v2/projectos',
   
        ];

        // Loop through and flush each endpoint
        foreach ($endpoints as $endpoint) {
            $cache_instance->delete_cache_by_endpoint($endpoint, \WP_REST_Cache_Plugin\Includes\Caching\Caching::FLUSH_LOOSE);
            error_log("Cache flushed for: " . $endpoint);
        }
    } else {
        error_log("Cache plugin class not found.");
    }
}


// Flush cache when a custom post type 'projectos' is saved, updated, or deleted
add_action('save_post_projectos', 'flush_projectos_cache', 10);
add_action('publish_projectos', 'flush_projectos_cache', 10);
add_action('delete_post', 'flush_projectos_cache', 10);

// Flush cache when a page is saved, updated, or deleted
add_action('save_post_page', 'flush_projectos_cache', 10);
add_action('publish_page', 'flush_projectos_cache', 10);
add_action('delete_post', 'flush_projectos_cache', 10);











add_action('rest_api_init', 'register_rest_images');

function register_rest_images() {
    register_rest_field(
        'projectos', // Assuming 'projectos' is your custom post type
        'featured_image', // This is the name that appears in the JSON response
        array(
            'get_callback'    => 'get_rest_featured_image',
            'update_callback' => null,
            'schema'          => null,
        )
    );
}

function get_rest_featured_image($object, $field_name, $request) {
    if (!empty($object['featured_media'])) {
        $img = wp_get_attachment_image_src($object['featured_media'], 'full');
        if ($img) {
            return array(
                'url' => $img[0], // The URL of the image
                'width' => $img[1], // The width of the image
                'height' => $img[2], // The height of the image
            );
        }
    }
    return null; // Return null if no image is found
}


function add_cors_http_header(){
    header("Access-Control-Allow-Origin: *"); // Allow all origins for testing
}
add_action('init','add_cors_http_header');


function get_project_years() {
    $cache_key = 'project_years';
    $cached_data = get_transient($cache_key);

    if ($cached_data !== false) {
        return new WP_REST_Response($cached_data, 200);
    }

    $args = array(
        'post_type' => 'projectos',
        'meta_key' => 'year',
        'orderby' => 'meta_value',
        'order' => 'DESC',
        'posts_per_page' => -1,
    );

    $projects = get_posts($args);
    $years = [];

    foreach ($projects as $project) {
        $year = get_post_meta($project->ID, 'year', true);
        if ($year) {
            $years[] = $year;
        }
    }

    $unique_years = array_unique($years, SORT_NUMERIC);
    sort($unique_years, SORT_DESC);

    set_transient($cache_key, $unique_years, DAY_IN_SECONDS); // Cache for 1 day

    return new WP_REST_Response($unique_years, 200);
}

add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/project_years', array(
        'methods' => 'GET',
        'callback' => 'get_project_years',
    ));
});







// Clear cache when a project is updated or created
function clear_projectos_cache() {
    delete_transient('projectos_pt');
    delete_transient('projectos_en');
    delete_transient('project_years');
}

add_action('save_post_projectos', 'clear_projectos_cache');
add_action('delete_post', 'clear_projectos_cache');











?>