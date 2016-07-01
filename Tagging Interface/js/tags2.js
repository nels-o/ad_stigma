var Tag = {
    config: {
        table: null,
        pplot: null
    },

    init: function ( ) {
        Tag.fetchTagTable( );
        $( "#avg_table_btn" )
            .click( function ( ) {
                Tag.fetchAvgTagTable( )
            } );
        $( "#stddev_table_btn" )
            .click( function ( ) {
                Tag.fetchStdDevTagTable( )
            } );
        $( "#table_btn" )
            .click( function ( ) {
                Tag.fetchTagTable( )
            } );

        $( window )
            .resize( function ( ) {
                //if(Tag.config.pplot!==null) Tag.config.pplot.width();
            } );
    },

    fetchTagTable: function ( ) {
        if ( Tag.config.table != null ) Tag.config.table.fnDestroy( );
        if ( Tag.config.pplot != null ) $( "#parplot" )
            .empty( );
        $( "#dt" )
            .empty( )
            .css( 'width', '100%' );
        $.ajax( {
            type: "get",
            url: './twit.php',
            data: {
                tag_table: ''
            },
            success: function ( data ) {
                data = data.filter(function(a){ return a['user'].indexOf("Racheal") > -1 || a['user'].indexOf("Pam") > -1});
                Tag.config.pplotdata = data.map( function ( a, b ) {
                    return {
                        user: a[ 'user' ],
                        metaphorical: ( ( Math.random( ) * 0.1 ) - 0.05 ) + parseFloat( a[ 'metaphorical' ] ),
                        informative:  ( ( Math.random( ) * 0.1 ) - 0.05 ) + parseFloat( a[ 'informative' ] ),
                        personal:     ( ( Math.random( ) * 0.1 ) - 0.05 ) + parseFloat( a[ 'personal_account' ] ),
                        joke:         ( ( Math.random( ) * 0.1 ) - 0.05 ) + parseFloat( a[ 'joke' ] ),
                        ridicule:     ( ( Math.random( ) * 0.1 ) - 0.05 ) + parseFloat( a[ 'ridicule' ] ),
                        organization: ( ( Math.random( ) * 0.1 ) - 0.05 ) + parseFloat( a[ 'organization' ] )
                    }
                } );
                var cmap = {
                    'Nels':    'rgb(141,211,199)',
                    'Riana':   'rgb(255,200,179)',
                    'Racheal': 'rgb(190,186,218)',
                    'Pam':     'rgb(251,128,114)',
                    'Jess':    'rgb(128,177,211)'
                }
                var cm = function ( d ) {
                    return cmap[ d.user ];
                }
                Tag.config.pplot = d3.parcoords( )( '#parplot' )
                    .data( Tag.config.pplotdata )
                    .mode( "queue" )
                    .alpha( 0.4 )
                    .color( cm )
                    .render( )
                    .interactive( )
                    .brushable( )
                    .reorderable( );

                Tag.config.table = $( '#dt' )
                    .dataTable( {
                        bProcessing: true,  
                        aaData: data,
                        fnRowCallback: function ( nRow, aData, iDisplayIndex ) {

                            // Links+hover for tweets
                            var l = $( '<a href="#" title=""></a>' );
                            l.html( aData[ 'tweetid' ] );
                            l.hover( function ( e ) {
                                if ( l.attr( 'title' ) != "" ) return;

                                $.ajax( {
                                    type: "get",
                                    url: './twit.php',
                                    data: {
                                        tweet: aData[ 'tweetid' ]
                                    },
                                    success: function ( data ) {
                                        l.attr( 'title', data.Text );
                                    }
                                } );
                            } );
                            $( 'td:eq(1)', nRow )
                                .html( l );

                            function cred( n ) {
                                var t = parseInt( n );
                                switch ( t ) {
                                case 0:
                                    return 'no';
                                case 1:
                                    return 'somewhat';
                                case 2:
                                    return 'fairly';
                                case 3:
                                    return 'significantly';
                                case 4:
                                    return 'completely';
                                default:
                                    return 'none';
                                }
                            }
                            // Conditional Color
                            if ( aData[ 'metaphorical' ] !== undefined ) {
                                $( 'td:eq(2)', nRow )
                                    .addClass( cred( aData[ 'metaphorical' ] ) );
                            }
                            // Conditional Color
                            if ( aData[ 'informative' ] !== undefined ) {
                                $( 'td:eq(3)', nRow )
                                    .addClass( cred( aData[ 'informative' ] ) );
                            }
                            // Conditional Color
                            if ( aData[ 'personal_account' ] !== undefined ) {
                                $( 'td:eq(4)', nRow )
                                    .addClass( cred( aData[ 'personal_account' ] ) );
                            }
                            // Conditional Color
                            if ( aData[ 'joke' ] !== undefined ) {
                                $( 'td:eq(5)', nRow )
                                    .addClass( cred( aData[ 'joke' ] ) );
                            }
                            // Conditional Color
                            if ( aData[ 'ridicule' ] !== undefined ) {
                                $( 'td:eq(6)', nRow )
                                    .addClass( cred( aData[ 'ridicule' ] ) );
                            }
                        },
                        aoColumns: [ {
                            mData: "user",
                            sTitle: "User"
                        }, {
                            mData: "tweetid",
                            sTitle: "Tweet"
                        }, {
                            mData: "metaphorical",
                            sTitle: "Metaphorical"
                        }, {
                            mData: "informative",
                            sTitle: "Informative"
                        }, {
                            mData: "personal_account",
                            sTitle: "Personal Account"
                        }, {
                            mData: "joke",
                            sTitle: "Joke"
                        }, {
                            mData: "ridicule",
                            sTitle: "Ridicule"
                        }, {
                            mData: "organization",
                            sTitle: "Personal or Organization"
                        }, {
                            mData: "garbage",
                            sTitle: "Junk"
                        } ]
                    } );
            }
        } );
    },

    fetchAvgTagTable: function ( ) {
        if ( Tag.config.table != null ) Tag.config.table.fnDestroy( );
        if ( Tag.config.pplot != null ) $( "#parplot" )
            .empty( );
        $( "#dt" )
            .empty( )
            .css( 'width', '100%' );
        $.ajax( {
            type: "get",
            url: './twit.php',
            data: {
                avg_tag_table: ''
            },
            success: function ( data ) {

                Tag.config.pplotdata = data.map( function ( a, b ) {
                    return {
                        //tweetid: a[ 'tweetid' ],
                        metaphorical: ( ( Math.random( ) * 0.1 ) - 0.05 ) + parseFloat( a[ 'metaphorical' ] ),
                        informative: ( ( Math.random( ) * 0.1 ) - 0.05 ) + parseFloat( a[ 'informative' ] ),
                        personal: ( ( Math.random( ) * 0.1 ) - 0.05 ) + parseFloat( a[ 'personal_account' ] ),
                        joke: ( ( Math.random( ) * 0.1 ) - 0.05 ) + parseFloat( a[ 'joke' ] ),
                        ridicule: ( ( Math.random( ) * 0.1 ) - 0.05 ) + parseFloat( a[ 'ridicule' ] )
                    }
                } );

                Tag.config.pplot = d3.parcoords( )( '#parplot' )
                    .data( Tag.config.pplotdata )
                    .mode( "queue" )
                    .alpha( 0.2 )
                    .render( )
                    .interactive( )
                    .brushable( )
                    .reorderable( );

                Tag.config.table = $( '#dt' )
                    .dataTable( {
                        bProcessing: true,
                        aaData: data,
                        fnRowCallback: function ( nRow, aData, iDisplayIndex ) {

                            /* Append the grade to the default row class name */
                            var l = $( '<a href="#" title=""></a>' );
                            l.html( aData[ 'tweetid' ] );
                            l.hover( function ( e ) {
                                if ( l.attr( 'title' ) != "" ) return;
                                $.ajax( {
                                    type: "get",
                                    url: './twit.php',
                                    data: {
                                        tweet: aData[ 'tweetid' ]
                                    },
                                    success: function ( data ) {
                                        l.attr( 'title', data.Text );
                                    }
                                } );
                            } );
                            $( 'td:eq(0)', nRow )
                                .html( l );

                            function cred( n ) {
                                var t = parseInt( n );
                                switch ( t ) {
                                case 0:
                                    return 'no';
                                case 1:
                                    return 'somewhat';
                                case 2:
                                    return 'fairly';
                                case 3:
                                    return 'significantly';
                                case 4:
                                    return 'completely';
                                default:
                                    return 'none';
                                }
                            }
                            // Conditional Color
                            if ( aData[ 'metaphorical' ] !== undefined ) {
                                $( 'td:eq(2)', nRow )
                                    .addClass( cred( aData[ 'metaphorical' ] ) );
                            }
                            // Conditional Color
                            if ( aData[ 'informative' ] !== undefined ) {
                                $( 'td:eq(3)', nRow )
                                    .addClass( cred( aData[ 'informative' ] ) );
                            }
                            // Conditional Color
                            if ( aData[ 'personal_account' ] !== undefined ) {
                                $( 'td:eq(4)', nRow )
                                    .addClass( cred( aData[ 'personal_account' ] ) );
                            }
                            // Conditional Color
                            if ( aData[ 'joke' ] !== undefined ) {
                                $( 'td:eq(5)', nRow )
                                    .addClass( cred( aData[ 'joke' ] ) );
                            }
                            // Conditional Color
                            if ( aData[ 'ridicule' ] !== undefined ) {
                                $( 'td:eq(6)', nRow )
                                    .addClass( cred( aData[ 'ridicule' ] ) );
                            }
                        },
                        aoColumns: [ {
                            mData: "tweetid",
                            sTitle: "Tweet"
                        }, {
                            mData: "ntags",
                            sTitle: "Number of tags"
                        }, {
                            mData: "metaphorical",
                            sTitle: "Metaphorical"
                        }, {
                            mData: "informative",
                            sTitle: "Informative"
                        }, {
                            mData: "personal_account",
                            sTitle: "Personal Account"
                        }, {
                            mData: "joke",
                            sTitle: "Joke"
                        },{
                            mData: "ridicule",
                            sTitle: "Ridicule"
                        }, {
                            mData: "organization",
                            sTitle: "Personal or Organization"
                        }, {
                            mData: "garbage",
                            sTitle: "Junk"
                        } ]
                    } );
            }
        } );
    },

    fetchStdDevTagTable: function ( ) {
        if ( Tag.config.table != null ) Tag.config.table.fnDestroy( );
        if ( Tag.config.pplot != null ) $( "#parplot" )
            .empty( );
        $( "#dt" )
            .empty( )
            .css( 'width', '100%' );

        $.ajax( {
            type: "get",
            url: './twit.php',
            data: {
                stdev_tag_table: ''
            },
            success: function ( data ) {
                Tag.config.pplotdata = data.map( function ( a, b ) {
                    return {
                        //tweetid: a[ 'tweetid' ],
                        metaphorical: ( ( Math.random( ) * 0.1 ) - 0.05 ) + parseFloat( a[ 'metaphorical' ] ),
                        informative: ( ( Math.random( ) * 0.1 ) - 0.05 ) + parseFloat( a[ 'informative' ] ),
                        personal: ( ( Math.random( ) * 0.1 ) - 0.05 ) + parseFloat( a[ 'personal_account' ] ),
                        joke: ( ( Math.random( ) * 0.1 ) - 0.05 ) + parseFloat( a[ 'joke' ] ),
                        ridicule: ( ( Math.random( ) * 0.1 ) - 0.05 ) + parseFloat( a[ 'ridicule' ] )
                    }
                } );

                Tag.config.pplot = d3.parcoords( )( '#parplot' )
                    .data( Tag.config.pplotdata )
                    .mode( "queue" )
                    .alpha( 0.2 )
                    .render( )
                    .interactive( )
                    .brushable( )
                    .reorderable( );

                Tag.config.table = $( '#dt' )
                    .dataTable( {
                        bProcessing: true,
                        aaData: data,
                        fnRowCallback: function ( nRow, aData, iDisplayIndex ) {

                            /* Append the grade to the default row class name */
                            var l = $( '<a href="#" title=""></a>' );
                            l.html( aData[ 'tweetid' ] );
                            l.hover( function ( e ) {
                                if ( l.attr( 'title' ) != "" ) return;
                                $.ajax( {
                                    type: "get",
                                    url: './twit.php',
                                    data: {
                                        tweet: aData[ 'tweetid' ]
                                    },
                                    success: function ( data ) {
                                        l.attr( 'title', data.Text );
                                    }
                                } );
                            } );
                            $( 'td:eq(0)', nRow )
                                .html( l );

                            function cred( n ) {
                                var t = parseFloat( n );

                                if ( t < 0.5 ) return 'zero';
                                if ( t < 1.0 ) return 'half';
                                if ( t < 1.5 ) return 'one';
                                if ( t < 2.0 ) return 'onehalf';
                                else return 'more';
                            }
                            // Conditional Color
                            if ( aData[ 'metaphorical' ] !== undefined ) {
                                $( 'td:eq(2)', nRow )
                                    .addClass( cred( aData[ 'metaphorical' ] ) );
                            }
                            // Conditional Color
                            if ( aData[ 'informative' ] !== undefined ) {
                                $( 'td:eq(3)', nRow )
                                    .addClass( cred( aData[ 'informative' ] ) );
                            }
                            // Conditional Color
                            if ( aData[ 'personal_account' ] !== undefined ) {
                                $( 'td:eq(4)', nRow )
                                    .addClass( cred( aData[ 'personal_account' ] ) );
                            }
                            // Conditional Color
                            if ( aData[ 'joke' ] !== undefined ) {
                                $( 'td:eq(5)', nRow )
                                    .addClass( cred( aData[ 'joke' ] ) );
                            }
                            // Conditional Color
                            if ( aData[ 'ridicule' ] !== undefined ) {
                                $( 'td:eq(6)', nRow )
                                    .addClass( cred( aData[ 'ridicule' ] ) );
                            }
                        },
                        aoColumns: [ {
                            mData: "tweetid",
                            sTitle: "Tweet"
                        }, {
                            mData: "ntags",
                            sTitle: "Number of tags"
                        }, {
                            mData: "metaphorical",
                            sTitle: "Metaphorical"
                        }, {
                            mData: "informative",
                            sTitle: "Informative"
                        }, {
                            mData: "personal_account",
                            sTitle: "Personal Account"
                        }, {
                            mData: "joke",
                            sTitle: "Joke"
                        }, {
                            mData: "ridicule",
                            sTitle: "Ridicule"
                        }, {
                            mData: "organization",
                            sTitle: "Personal or Organization"
                        }, {
                            mData: "garbage",
                            sTitle: "Junk"
                        } ]
                    } );
            }
        } );
    }
}

$( function ( ) {
    Tag.init( );
} );
