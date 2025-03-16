<?php
/**
 * UnderStrap functions and definitions
 *
 * @package UnderStrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$understrap_includes = array(
	'/theme-settings.php',                  // Initialize theme default settings.
	'/setup.php',                           // Theme setup and custom theme supports.
	'/widgets.php',                         // Register widget area.
	'/enqueue.php',                         // Enqueue scripts and styles.
	'/template-tags.php',                   // Custom template tags for this theme.
	'/pagination.php',                      // Custom pagination for this theme.
	'/hooks.php',                           // Custom hooks.
	'/extras.php',                          // Custom functions that act independently of the theme templates.
	'/customizer.php',                      // Customizer additions.
	// '/custom-comments.php',                 // Custom Comments file.
	'/jetpack.php',                         // Load Jetpack compatibility file.
	'/class-wp-bootstrap-navwalker.php',    // Load custom WordPress nav walker. Trying to get deeper navigation? Check out: https://github.com/understrap/understrap/issues/567.
	// '/woocommerce.php',                     // Load WooCommerce functions.
	'/editor.php',                          // Load Editor functions.
	'/deprecated.php',                      // Load deprecated functions.


	'/scripts.php',                           // Theme setup and custom theme supports.
	'/ajax/test.php',                           // Theme setup and custom theme supports.

);

// foreach ( $understrap_includes as $file ) {
// 	require_once get_template_directory() . '/inc' . $file;
// }

function register_menu_dois() {
	register_nav_menu('menu-dois',__( 'Menu secundario' ));
  }
  add_action( 'init', 'register_menu_dois' );

  function load_my_script(){

	wp_register_style('CustomScrollbar_css', get_template_directory_uri() . '/css/jquery.mCustomScrollbar.min.css');
	wp_enqueue_style('CustomScrollbar_css');
	// wp_register_script('CustomScrollbar_js', get_template_directory_uri() . '/js/jquery.mCustomScrollbar.min.js', null, true);
	// wp_enqueue_script('CustomScrollbar_js');

	
	wp_enqueue_script( 'gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/gsap.min.js', array(), false, true );
	wp_enqueue_script( 'ScrollTrigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/ScrollTrigger.min.js', array(), false, true );
	wp_enqueue_script( 'Scrollbar', 'https://unpkg.com/smooth-scrollbar@latest/dist/smooth-scrollbar.js', array(), false, true );
	wp_enqueue_script( 'smoothstate', 'https://cdnjs.cloudflare.com/ajax/libs/smoothState.js/0.7.2/jquery.smoothState.min.js', array(), false, true );
	wp_enqueue_script( 'mCustomScrollbar_js_cdn', "https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.4/jquery.mCustomScrollbar.min.js", array('jquery'), false, true );
  // wp_enqueue_style('mCustomScrollbar_css', 'https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.4/jquery.mCustomScrollbar.min.css');
  wp_register_script('transit', get_template_directory_uri() . '/js/jquery.transit.js', array('jquery') , null, true);
	wp_enqueue_script('transit');
	// wp_enqueue_style('Splitting_cells_css', 'https://unpkg.com/splitting/dist/splitting-cells.css');
	

	
}
add_action('wp_enqueue_scripts', 'load_my_script');

add_filter( 'acf/settings/rest_api_format', function () {
    return 'standard';
} );

add_filter( 'wp_nav_menu_items', 'custom_menu_item', 10, 2 );
function custom_menu_item ( $items, $args ) {
    if ($args->theme_location == 'primary') {
        $items .= '<li  itemscope="itemscope" itemtype="https://www.schema.org/SiteNavigationElement" id="menu-item-4000000" class=" socialmedia menu-item menu-item-type-post_type menu-item-object-page menu-item-4000000 nav-item">
		<a title="insta" target="_blank" rel="noopener noreferrer" href="https://instagram.com/aw_artworks?igshid=3rs6xir7bxf5" class="nav-link">insta</a>
		<span class=""> &nbsp; &nbsp; </span>
		<a title="fb" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/artworks.art.production/" class="nav-link">fb</a>
		<span class=""> &nbsp; &nbsp; </span>
		<a title="vimeo" target="_blank" rel="noopener noreferrer" href="https://vimeo.com/user79925672" class="nav-link" >vimeo</a>

		</li>';
    }
    return $items;
}
add_action( 'rest_api_init', function () {

	register_rest_route( 'artworks/', 'get-by-slug', array(
		  'methods' => 'GET',
		  'callback' => 'my_theme_get_content_by_slug',
		  'args' => array(
			  'slug' => array (
				  'required' => false
			  )
		  )
	  ) );

  } );


  function my_theme_get_content_by_slug( WP_REST_Request $request ) {
    
    // get slug from request
    $slug = $request['slug']; 

    // get content by slug
    $return['content'] = get_page_by_path( $slug, ARRAY_A ); 
    
    // // add comments to our content
    // $return['content']['comments'] = get_comments( array( 'ID' => $return['content']['ID'] ) );
     

    $response = new WP_REST_Response( $return );
    return $response;

}

// add_action('init','my_func');

// function my_func() {
//     global $wp_query;
//     // var_dump($wp_query);
//      var_dump($GLOBALS['wp_query']);
// }





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
            $featured_image = wp_get_attachment_image_src($featured_image_id, 'thumbnail');

            if ($featured_image) {
                $featured_image_url = $featured_image[0];
                $featured_image_width = $featured_image[1];
                $featured_image_height = $featured_image[2];
            } else {
                $featured_image_url = '';
                $featured_image_width = 0;
                $featured_image_height = 0;
            }

            $artistas = wp_get_post_terms(get_the_ID(), 'artistas', array('fields' => 'ids'));
            $materiais = wp_get_post_terms(get_the_ID(), 'materiais', array('fields' => 'ids'));

            $projects[] = array(
                'id' => get_the_ID(),
                'title' => array('rendered' => get_the_title()),
                'slug' => get_post_field('post_name', get_the_ID()),
                'content' => get_the_content(),
                'featured_media' => $featured_image_id,
                'featured_image' => array(
                    'url' => $featured_image_url,
                    'width' => $featured_image_width,
                    'height' => $featured_image_height,
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
            $featured_image = wp_get_attachment_image_src($featured_image_id, 'thumbnail');
            
            // Check if the image exists and get its URL, width, and height
            if ($featured_image) {
                $featured_image_url = $featured_image[0]; // URL
                $featured_image_width = $featured_image[1]; // Width
                $featured_image_height = $featured_image[2]; // Height
            } else {
                $featured_image_url = '';
                $featured_image_width = 0;
                $featured_image_height = 0;
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
        $img = wp_get_attachment_image_src($object['featured_media'], 'app-thumb');
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

